// Package money berisi tipe dan perhitungan uang Rupiah.
// Uang selalu bilangan bulat Rupiah. Jangan pernah memakai float untuk uang.
package money

import (
	"strconv"
	"strings"
)

// Rupiah adalah nominal dalam Rupiah utuh.
type Rupiah int64

// String memformat seperti di struk: Rp18.000, -Rp5.500.
func (r Rupiah) String() string {
	n := int64(r)
	neg := n < 0
	if neg {
		n = -n
	}
	digits := strconv.FormatInt(n, 10)

	var b strings.Builder
	if neg {
		b.WriteByte('-')
	}
	b.WriteString("Rp")
	for i, c := range digits {
		if i > 0 && (len(digits)-i)%3 == 0 {
			b.WriteByte('.')
		}
		b.WriteRune(c)
	}
	return b.String()
}

// RoundMode menentukan arah pembulatan.
type RoundMode int

const (
	// RoundNearest membulatkan ke kelipatan terdekat, setengah ke atas (Rp1.250 → Rp1.300 untuk kelipatan 100).
	RoundNearest RoundMode = iota
	// RoundDown selalu ke bawah (menguntungkan pembeli).
	RoundDown
	// RoundUp selalu ke atas.
	RoundUp
)

// Round membulatkan ke kelipatan step (misalnya 100, 500, 1000).
// step <= 1 berarti tanpa pembulatan.
func (r Rupiah) Round(step int64, mode RoundMode) Rupiah {
	if step <= 1 {
		return r
	}
	n := int64(r)
	neg := n < 0
	if neg {
		n = -n
	}
	rem := n % step
	base := n - rem
	switch mode {
	case RoundDown:
		n = base
	case RoundUp:
		if rem > 0 {
			n = base + step
		}
	default:
		if rem*2 >= step {
			n = base + step
		} else {
			n = base
		}
	}
	if neg {
		n = -n
	}
	return Rupiah(n)
}

// PercentBP menghitung persentase dalam basis poin (1% = 100 bp), dibulatkan setengah ke atas.
// Contoh: PBJT 10% dari Rp87.000 → Rupiah(87000).PercentBP(1000) = Rp8.700.
func (r Rupiah) PercentBP(bp int64) Rupiah {
	n := int64(r) * bp
	q, rem := n/10000, n%10000
	if rem*2 >= 10000 {
		q++
	} else if rem*2 <= -10000 {
		q--
	}
	return Rupiah(q)
}

// SplitEven membagi total ke n bagian yang jumlahnya tetap sama dengan total.
// Sisa pembagian diberikan ke bagian pertama, supaya bagi rata tidak pernah selisih Rp1.
func (r Rupiah) SplitEven(n int) []Rupiah {
	if n <= 0 {
		return nil
	}
	total := int64(r)
	each := total / int64(n)
	rest := total - each*int64(n)
	parts := make([]Rupiah, n)
	for i := range parts {
		parts[i] = Rupiah(each)
	}
	parts[0] += Rupiah(rest)
	return parts
}
