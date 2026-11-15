package money

import "testing"

func TestString(t *testing.T) {
	cases := map[Rupiah]string{
		0:          "Rp0",
		500:        "Rp500",
		1000:       "Rp1.000",
		18000:      "Rp18.000",
		2402000:    "Rp2.402.000",
		-5500:      "-Rp5.500",
		1000000000: "Rp1.000.000.000",
	}
	for in, want := range cases {
		if got := in.String(); got != want {
			t.Errorf("Rupiah(%d).String() = %q, mau %q", int64(in), got, want)
		}
	}
}

func TestRound(t *testing.T) {
	cases := []struct {
		in   Rupiah
		step int64
		mode RoundMode
		want Rupiah
	}{
		{75130, 100, RoundNearest, 75100},
		{75150, 100, RoundNearest, 75200},
		{75130, 500, RoundNearest, 75000},
		{75250, 500, RoundNearest, 75500},
		{75130, 1000, RoundDown, 75000},
		{75001, 1000, RoundUp, 76000},
		{75000, 1000, RoundUp, 75000},
		{-1250, 100, RoundNearest, -1300},
		{1234, 1, RoundNearest, 1234},
	}
	for _, c := range cases {
		if got := c.in.Round(c.step, c.mode); got != c.want {
			t.Errorf("Rupiah(%d).Round(%d, %d) = %d, mau %d", c.in, c.step, c.mode, got, c.want)
		}
	}
}

func TestPercentBP(t *testing.T) {
	cases := []struct {
		in   Rupiah
		bp   int64
		want Rupiah
	}{
		{87000, 1000, 8700},   // PBJT 10%
		{87000, 500, 4350},    // service 5%
		{18500, 1100, 2035},   // PPN 11%
		{99, 1000, 10},        // 9,9 → 10
		{94, 1000, 9},         // 9,4 → 9
		{-87000, 1000, -8700}, // refund
	}
	for _, c := range cases {
		if got := c.in.PercentBP(c.bp); got != c.want {
			t.Errorf("Rupiah(%d).PercentBP(%d) = %d, mau %d", c.in, c.bp, got, c.want)
		}
	}
}

func TestSplitEvenKeepsTotal(t *testing.T) {
	parts := Rupiah(100000).SplitEven(3)
	if len(parts) != 3 {
		t.Fatalf("len = %d", len(parts))
	}
	var sum Rupiah
	for _, p := range parts {
		sum += p
	}
	if sum != 100000 {
		t.Errorf("jumlah = %d, mau 100000", sum)
	}
	if parts[0] != 33334 || parts[1] != 33333 {
		t.Errorf("parts = %v", parts)
	}
	if Rupiah(1000).SplitEven(0) != nil {
		t.Error("SplitEven(0) harus nil")
	}
}
