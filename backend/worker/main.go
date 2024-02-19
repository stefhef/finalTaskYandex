package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"

	"github.com/jackc/pgx/v5"
)

var wg sync.WaitGroup

var TIME_ADDITION = time.Millisecond * 100
var TIME_SUBTRACTION = time.Millisecond * 500
var TIME_MULTIPLICATION = time.Millisecond * 1000
var TIME_DIVISION = time.Millisecond * 1000
var TIME_MODULO = time.Millisecond * 1000
var TIME_ABS = time.Millisecond * 1000
var TIME_SIN = time.Millisecond * 1000
var TIME_COS = time.Millisecond * 1000
var TIME_TG = time.Millisecond * 1000
var TIME_CTG = time.Millisecond * 1000
var TIME_FACTORIAL = time.Millisecond * 10000

type Expression struct {
	token string
	Args  []Expression
}

func NewExpression(token string, args ...Expression) Expression {
	return Expression{token: token, Args: args}
}

type Parser struct {
	input string
}

func NewParser(input string) *Parser {
	return &Parser{input: input}
}

func (p *Parser) Parse() Expression {
	return p.parseBinaryExpression(0)
}

func (p *Parser) parseToken() string {
	input := p.input
	for len(input) > 0 && unicode.IsSpace(rune(input[0])) {
		input = input[1:]
	}
	p.input = input

	if len(input) > 0 && unicode.IsDigit(rune(input[0])) {
		number := []rune{}
		for len(input) > 0 && (unicode.IsDigit(rune(input[0])) || input[0] == '.') {
			number = append(number, rune(input[0]))
			input = input[1:]
		}
		p.input = input
		return string(number)
	}

	tokens := []string{"+", "-", "**", "*", "/", "mod", "abs", "sin", "cos", "(", ")", "tg", "ctg", "!", "pi"}
	for _, t := range tokens {
		if strings.HasPrefix(input, t) {
			input := input[len(t):]
			p.input = input
			if t == "pi" {
				return "3.1415926535"
			}
			return t
		}
	}
	return ""
}

func (p *Parser) parseSimpleExpression() Expression {
	token := p.parseToken()
	// if (token.empty()) throw "Пустой ввод((";

	if token == "(" {
		result := p.Parse()
		// if (parse_token() != ")") throw "Надо закрывающую скобку((";
		return result
	}

	if _, err := strconv.Atoi(token); err == nil {
		return NewExpression(token)
	}

	return NewExpression(token, p.parseSimpleExpression())
}

func (p *Parser) parseBinaryExpression(minPriority int) Expression {
	leftExpr := p.parseSimpleExpression()
	for {
		op := p.parseToken()
		priority := getPriority(op)
		if priority <= minPriority {
			input := op + p.input
			p.input = input
			return leftExpr
		}
		rightExpr := p.parseBinaryExpression(priority)
		leftExpr = NewExpression(op, leftExpr, rightExpr)
	}
}

func getPriority(binary_op string) int {
	switch binary_op {
	case "+", "-":
		return 1
	case "*", "/", "mod":
		return 2
	case "^":
		return 3
	default:
		return 0
	}
}

func factorial(number int) int {
	answer := 1
	for iterator := 1; iterator <= number; iterator++ {
		answer = answer * iterator
	}
	return answer
}

func eval(e Expression) (float64, error) {
	switch len(e.Args) {
	case 2:
		a, err := eval(e.Args[0])
		if err != nil {
			return 0, err
		}
		b, err := eval(e.Args[1])
		if err != nil {
			return 0, err
		}
		switch e.token {
		case "+":
			time.Sleep(TIME_ADDITION)
			return a + b, nil
		case "-":
			time.Sleep(TIME_SUBTRACTION)
			return a - b, nil
		case "*":
			time.Sleep(TIME_MULTIPLICATION)
			return a * b, nil
		case "/":
			time.Sleep(TIME_DIVISION)
			if b == 0 {
				return 0, errors.New("на ноль делить нельзя((")
			}
			return a / b, nil
		case "**":
			return math.Pow(a, b), nil
		case "mod":
			time.Sleep(TIME_MODULO)
			return float64(int(a) % int(b)), nil
		default:
			return 0, errors.New("неизвестный бинарный оператор")
		}
	case 1:
		a, err := eval(e.Args[0])
		if err != nil {
			return 0, err
		}
		switch e.token {
		case "+":
			return +a, nil
		case "-":
			return -a, nil
		case "abs":

			return math.Abs(a), nil
		case "sin":
			time.Sleep(TIME_SIN)
			return math.Sin(a), nil
		case "cos":
			time.Sleep(TIME_COS)
			return math.Cos(a), nil
		case "tg":
			time.Sleep(TIME_TG)
			return math.Tan(a), nil
		case "ctg":
			time.Sleep(TIME_CTG)
			return 1 / math.Tan(a), nil
		case "!":
			time.Sleep(TIME_FACTORIAL)
			if a < 0 {
				return 0, errors.New("факториал отрицательного числа пока не определён")
			}
			return float64(factorial(int(a))), nil
		default:
			return 0, errors.New("неизвестный унарный оператор")
		}
	case 0:
		if e.token == "pi" {
			return math.Pi, nil
		}
		value, err := strconv.ParseFloat(e.token, 64)
		if err != nil {
			return 0, err
		}
		return value, nil
	default:
		return 0, errors.New("неизвестный тип выражения	")
	}
}

func Calculation(expression Exp) error {
	parser := NewParser(expression.Text)
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Fatalf("Ошибка при подключении к базе данных,  выражение ID: %d, ошибка: %s", expression.ID, err.Error())
		return err
	}
	result, err := eval(parser.Parse())
	if err != nil {
		_, err = conn.Exec(context.Background(), "UPDATE expressions SET status = 400, data_calculated=$2 WHERE id = $1", expression.ID, time.Now().Format("2006-01-02 15:04:05"))
		log.Fatalf("Ошибка при вычислении выражения ID: %d, ошибка: %s", expression.ID, err.Error())
		return err
	}
	_, err = conn.Exec(context.Background(), "UPDATE expressions SET result = $1, status = 200, data_calculated=$3 WHERE id = $2", result, expression.ID, time.Now().Format("2006-01-02 15:04:05"))
	log.Printf("Вычисление выражения ID: %d, завершено", expression.ID)

	return err
}

type Exp struct {
	ID             int
	Text           string
	Status         int
	DataCalculated string
	Result         float64
	WorkStart      time.Time
}

var N = 10 // количество выражений для расчета

func GetWork() ([]*Exp, error) {
	conn, err := pgx.Connect(context.Background(), "postgres://admin:root@postgres_container:5432/main")
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	rows, err := conn.Query(context.Background(), fmt.Sprintf("SELECT id, expression, status FROM expressions WHERE status = 300 LIMIT %d", N))
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer rows.Close()

	var expressions []*Exp
	for rows.Next() {
		var expression Exp
		err := rows.Scan(&expression.ID, &expression.Text, &expression.Status)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}
		expressions = append(expressions, &expression)
	}
	return expressions, nil
}

func main() {
	log.Println("Воркер запущен")
	ticker := time.NewTicker(30 * time.Second)
	var oldExpressions, allExpressions []*Exp
	allExpressions, err := GetWork()
	if err != nil {
		log.Fatal(err)
	}
	for _, expression := range allExpressions {
		log.Printf("Новое выражение принято в работу: \nID: %d\n Выражение:%s", expression.ID, expression.Text)
		go Calculation(*expression)
	}
	wg.Add(1)
	go func() {
		for {
			select {
			case <-ticker.C:
				oldExpressions = allExpressions
				allExpressions, err := GetWork()
				if len(allExpressions) == 0 {
					log.Println("Нет новых выражений")
					continue
				}
				if err != nil {
					log.Fatal(err)
				}
				for i := 0; i < len(allExpressions); i++ {
					if len(oldExpressions) != 0 {
						if allExpressions[i] != oldExpressions[i] {
							log.Printf("Новое выражение принято в работу: \nID: %d\n Выражение:%s", allExpressions[i].ID, allExpressions[i].Text)
							go Calculation(*allExpressions[i])
						}
					}
				}

			}
		}
	}()
	wg.Wait()
}
