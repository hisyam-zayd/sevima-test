<?php
echo " POC 2: PENYIMPANAN & KOMPUTASI DI LEVEL DATABASE \n";

$host = 'db';
$db   = 'poc_db';
$user = 'sevima_user';
$pass = 'sevima_password';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "[STATUS] Berhasil terkoneksi ke PostgreSQL.\n\n";

    // 1. Persiapan Tabel & Data
    $pdo->exec("DROP TABLE IF EXISTS test_varchar");
    $pdo->exec("DROP TABLE IF EXISTS test_numeric");
    
    $pdo->exec("CREATE TABLE test_varchar (id SERIAL, angka VARCHAR)");
    $pdo->exec("CREATE TABLE test_numeric (id SERIAL, angka NUMERIC)");

    // Angka 1: Limit 64-bit (19 digit). Angka 2: Sangat masif (30 digit)
    $angka1 = '9223372036854775807'; 
    $angka2 = '500000000000000000000000000000'; 

    $pdo->exec("INSERT INTO test_varchar (angka) VALUES ('$angka1'), ('$angka2')");
    $pdo->exec("INSERT INTO test_numeric (angka) VALUES ('$angka1'), ('$angka2')");


    echo " BUKTI 1: BAHAYA MENGGUNAKAN VARCHAR (TEXT) \n";
    $stmt = $pdo->query("SELECT angka FROM test_varchar ORDER BY angka DESC");
    $results = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Hasil Sorting DESC:\n";
    echo "1. " . $results[0] . "\n2. " . $results[1] . "\n";
    echo "Kesimpulan: Salah! Nilai angka 1 (awalan 9) dianggap lebih besar daripada angka 2 (awalan 5) hanya karena secara abjad huruf '9' > '5'.\n\n";


    echo " BUKTI 2: NUMERIC SEBAGAI SOLUSI NATIVE DATABASE \n";
    $stmt = $pdo->query("SELECT angka FROM test_numeric ORDER BY angka DESC");
    $results = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Hasil Sorting DESC:\n";
    echo "1. " . $results[0] . "\n2. " . $results[1] . "\n";
    echo "Kesimpulan: Benar! PostgreSQL dapat menghitung secara presisi.\n\n";

    echo " BUKTI 3: ARITMETIKA NATIVE PADA TIPE NUMERIC \n";
    $stmt = $pdo->query("
        SELECT 
            (SELECT angka FROM test_numeric WHERE id = 2) * 2 AS hasil_kali,
            (SELECT angka FROM test_numeric WHERE id = 2) / 5 AS hasil_bagi
    ");
    $math = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Operasi (Angka ke-2 x 2) : " . $math['hasil_kali'] . "\n";
    echo "Operasi (Angka ke-2 / 5) : " . $math['hasil_bagi'] . "\n";
    echo "Kesimpulan: Komputasi matematis berhasil dieksekusi murni di level Database secara presisi\n";
} catch (PDOException $e) {
    echo "Koneksi Gagal: " . $e->getMessage() . "\n";
}
?>