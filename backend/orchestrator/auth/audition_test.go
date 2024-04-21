package auth

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestCreateToken(t *testing.T) {
	cases := []struct {
		name           string
		username       string
		hashedPassword string
		want           bool
	}{
		{
			name:           "simple jwt",
			username:       "123",
			hashedPassword: "123",
			want:           true,
		},
	}
	for _, tc := range cases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			access_token := CreateToken(tc.username, tc.hashedPassword)
			now := time.Now()
			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"name":     tc.username,
				"password": tc.hashedPassword,
				"nbf":      now.Unix(),
				"exp":      now.Add(5 * time.Minute).Unix(),
				"iat":      now.Unix(),
			})

			tokenString, _ := token.SignedString([]byte(hmacSampleSecret))
			got := tokenString == access_token
			if got != tc.want {
				t.Errorf("CreateToken(%s, %s) = %t; want %t", tc.username, tc.hashedPassword, got, tc.want)
			}
		})
	}
}
