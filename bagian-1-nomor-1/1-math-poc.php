<?php
echo " POC 1: ARITMETIKA 2048-BIT DI LEVEL APLIKASI (PHP) \n";

// Kita gunakan angka yang jauh melebihi limit 64-bit (19 digit desimal).
// Input harus berupa string agar parser PHP tidak merusaknya menjadi float di awal.
$angka_A_str = "50000000000000000000000000000000000000000000000000"; // 50 digit
$angka_B_str = "20000000000000000000000000000000000000000000000000"; // 50 digit

echo "[INPUT]\n";
echo "Angka A: {$angka_A_str}\n";
echo "Angka B: {$angka_B_str}\n\n";

echo " SKENARIO 1: OPERASI NATIVE (TANPA EKSTENSI) \n";
// PHP akan memaksakan string numerik raksasa menjadi float (scientific notation)
$native_tambah = $angka_A_str + $angka_B_str; 
$native_kurang = $angka_A_str - $angka_B_str;
$native_kali   = $angka_A_str * $angka_B_str;
$native_bagi   = $angka_A_str / $angka_B_str;

echo "Tambah (+) : " . $native_tambah . " (Presisi Hilang, berubah ke " . gettype($native_tambah) . ")\n";
echo "Kurang (-) : " . $native_kurang . "\n";
echo "Kali   (x) : " . $native_kali . "\n";
echo "Bagi   (/) : " . $native_bagi . "\n\n";


echo " SKENARIO 2: OPERASI BIGNUM ARRAY (GMP EXTENSION) \n";
// Mengubah string menjadi Bignum Resource (Array of 64-bit Limbs)
$gmp_A = gmp_init($angka_A_str);
$gmp_B = gmp_init($angka_B_str);

$gmp_tambah = gmp_add($gmp_A, $gmp_B);
$gmp_kurang = gmp_sub($gmp_A, $gmp_B);
$gmp_kali   = gmp_mul($gmp_A, $gmp_B);
$gmp_bagi   = gmp_div($gmp_A, $gmp_B);

echo "Tambah (+) : " . gmp_strval($gmp_tambah) . " (Presisi 100% Terjaga)\n";
echo "Kurang (-) : " . gmp_strval($gmp_kurang) . "\n";
echo "Kali   (x) : " . gmp_strval($gmp_kali) . "\n";
echo "Bagi   (/) : " . gmp_strval($gmp_bagi) . "\n";
?>