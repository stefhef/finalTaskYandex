package main

import (
	"sync"
	"testing"
)

func TestCalculation(t *testing.T) {

	t.Parallel()
	cases := []struct {
		name       string
		expression *Exp
		want       float64
	}{
		{
			name:       "simple operation positive",
			expression: &Exp{ID: 1, Text: "2 + 3", Status: 200},
			want:       5,
		},
		{
			name:       "simple operation negative",
			expression: &Exp{ID: 1, Text: "2 - 3", Status: 200},
			want:       -1,
		},
	}
	var wg sync.WaitGroup
	for _, tc := range cases {
		wg.Add(1)
		t.Run(tc.name, func(t *testing.T) {
			Calculation(*tc.expression)
			wg.Done()
			if tc.want != tc.expression.Result {
				t.Errorf("Incorrect result. Expected: %f, Got: %f", tc.want, tc.expression.Result)
			}
		})

	}
	wg.Wait()
}
