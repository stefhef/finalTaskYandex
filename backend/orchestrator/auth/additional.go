package auth

import (
	"fmt"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const hmacSampleSecret = "super_secret_signature"

func CreateToken(username string, hashedPassword string) string {

	now := time.Now()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name":     username,
		"password": hashedPassword,
		"nbf":      now.Unix(),
		"exp":      now.Add(5 * time.Minute).Unix(),
		"iat":      now.Unix(),
	})

	tokenString, err := token.SignedString([]byte(hmacSampleSecret))
	if err != nil {
		log.Println("Ошибка: ", err)
	}

	log.Printf("Новый токен для пользователя '%s' создан: %s\n", username, tokenString)

	return tokenString
}

func DecodeToken(tokenString string) (string, string, error) { // Первое - имя пользователя, второе - пароль
	tokenFromString, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			panic(fmt.Errorf("unexpected signing method: %v", token.Header["alg"]))
		}

		return []byte(hmacSampleSecret), nil
	})
	if err != nil {
		log.Println(err)
		return "", "", err
	}
	if claims, ok := tokenFromString.Claims.(jwt.MapClaims); ok {
		username := claims["name"].(string)
		password := claims["password"].(string)
		return username, password, nil
	}
	log.Println(err)
	return "", "", err
}
