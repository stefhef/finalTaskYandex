package database

import (
	"context"
	"log"
	"time"

	"githgub.com/stefhef/finalTaskYandex/orchestrator/graph/model"

	"github.com/jackc/pgx/v5"
)

func GetAllExpressions() ([]*model.Expression, error) {
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@localhost:5432/main")
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	rows, err := conn.Query(context.Background(), "SELECT id, expression, status, data_created, data_calculated, result FROM expressions")
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer rows.Close()

	var expressions []*model.Expression
	for rows.Next() {
		var expression model.Expression
		err := rows.Scan(&expression.ID, &expression.Text, &expression.Status, &expression.DataCreated, &expression.DataCalculated, &expression.Result)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}
		expressions = append(expressions, &expression)
	}
	return expressions, nil
}

func AddExpression(text string) (*model.Expression, error) {
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@localhost:5432/main")
	if err != nil {
		return &model.Expression{}, err
	}
	var expression model.Expression
	err = conn.QueryRow(context.Background(), "INSERT INTO expressions (expression, status, data_created) VALUES ($1, 300, $2) RETURNING id, expression, status, data_created", text, time.Now().Format("2006-01-02 15:04:05")).Scan(&expression.ID, &expression.Text, &expression.Status, &expression.DataCreated)
	if err != nil {
		log.Fatal(err)
		return &model.Expression{}, err
	}
	log.Print("Выражение " + text + " записано")
	return &expression, nil
}
