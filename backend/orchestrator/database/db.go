package database

import (
	"context"
	"errors"
	"log"
	"time"

	"githgub.com/stefhef/finalTaskYandex/orchestrator/auth"
	"githgub.com/stefhef/finalTaskYandex/orchestrator/graph/model"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
)

func GetAllExpressions(access_token string) ([]*model.Expression, error) {
	username, err := AproveToken(access_token)
	if err != nil {
		log.Println(err)
		return []*model.Expression{}, err
	}

	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	rows, err := conn.Query(context.Background(), "SELECT id, expression, status, data_created, data_calculated, result FROM expressions WHERE username = $1", username)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	var expressions []*model.Expression
	for rows.Next() {
		var expression model.Expression
		err := rows.Scan(&expression.ID, &expression.Text, &expression.Status, &expression.DataCreated, &expression.DataCalculated, &expression.Result)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		expressions = append(expressions, &expression)
	}
	return expressions, nil
}

func AddExpression(text string, accses_token string) (*model.Expression, error) {
	username, err := AproveToken(accses_token)
	if err != nil {
		log.Println(err)
		return &model.Expression{}, err
	}
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Println(err)
		return &model.Expression{}, err
	}
	var expression model.Expression
	err = conn.QueryRow(context.Background(), "INSERT INTO expressions (expression, status, data_created, username) VALUES ($1, 300, $2, $3) RETURNING id, expression, status, data_created", text, time.Now().Format("2006-01-02 15:04:05"), username).Scan(&expression.ID, &expression.Text, &expression.Status, &expression.DataCreated)
	if err != nil {
		log.Print("Ошибка при добавлении нового выражения в БД в AddExpression")
		log.Println(err)
		return &model.Expression{}, err
	}
	log.Printf("Выражение %s от пользователя %s записано", text, username)
	return &expression, nil
}

func AddUser(username string, password string) (string, error) {
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Print("Ошибка при подключении к БД в AddUser")
		log.Println(err)
		return "", err
	}

	// var testPassword string
	// err = conn.QueryRow(context.Background(), "SELECT password FROM users WHERE username = $1", username).Scan(&testPassword)

	// log.Printf("Ошибка %s", err)
	// if err != nil && err != pgx.ErrNoRows || err == nil {
	// 	log.Println(err)
	// 	return "", err
	// }

	// if testPassword != "" {
	// 	log.Printf("Пользователь %s уже зарегистрирован", username)
	// 	return "", errors.New("пользователь уже зарегистрирован")
	// }

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Println(err)
		return "", err
	}

	_, err = conn.Exec(context.Background(), "INSERT INTO users (username, password) VALUES ($1, $2)", username, hashedPassword)
	if err != nil {
		log.Printf("Ошибка при потпытке добавить пользователя %s в БД в AddUser", username)
		log.Println(err)
		return "", err
	}
	log.Printf("Пользователь %s зарегистрирован", username)
	access_token := auth.CreateToken(username, string(hashedPassword))
	return access_token, nil
}

func GetUserPassword(username string) (string, error) {
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Print("Ошибка при подключении к базе в GetUserPassword")
		log.Println(err)
		return "", err
	}

	var password string
	err = conn.QueryRow(context.Background(), "SELECT password FROM users WHERE username = $1", username).Scan(&password)
	if err != nil {
		log.Print("Ошибка при получении пароля пользователя в GetUserPassword")
		log.Println(err)
		return "", err
	}
	return password, nil
}

func VerificateUser(username string, password string) bool {
	hashedPassword, err := GetUserPassword(username)
	if err != nil {
		log.Println(err)
		return false
	}
	log.Printf("Пароль пользователя %s: %s", username, hashedPassword)

	if password != hashedPassword {
		log.Println("Неверный пароль в VerificateUser")
		return false
	}
	return true

}

func AproveToken(access_token string) (string, error) {
	username, password, err := auth.DecodeToken(access_token)
	if err != nil {
		return "", err
	}
	if !VerificateUser(username, password) {
		return "", errors.New("неверный пароль")
	}
	return username, nil
}

func GetUser(username string, password string) (string, error) {
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Print(" Ошибка при подключении к БД в GetUser")
		log.Println(err)
		return "", err
	}
	var hashedPassword string
	err = conn.QueryRow(context.Background(), "SELECT password FROM users WHERE username = $1", username).Scan(&hashedPassword)
	if err != nil {
		log.Print(" Ошибка при получении пароля пользователя в GetUser")
		log.Println(err)
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		log.Print(" Ошибка в bcrypt.CompareHashAndPassword в GetUser")
		log.Println(err)
		return "", err
	}
	access_token := auth.CreateToken(username, string(hashedPassword))
	log.Printf("Пользователь %s авторизован", username)
	return access_token, nil
}
