<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db.php';

$results = [];

// Test credentials
$creds = [
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_galaxy', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_galaxy', 'pass' => 'galaxy2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_galaxy', 'pass' => 'Galaxy@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_galaxy', 'pass' => 'galaxyhotel2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_thuonguit', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_thuonguit', 'pass' => 'galaxy2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_thuonguit', 'pass' => 'thuonguit@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_thuonguit', 'pass' => 'Galaxy@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_user', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'rnaacriz_admin', 'pass' => 'GalaxyHotel@2026'],
    ['host' => 'localhost', 'name' => 'rnaacriz_galaxy', 'user' => 'root', 'pass' => '']
];

foreach ($creds as $c) {
    try {
        $testPdo = new PDO("mysql:host={$c['host']};dbname={$c['name']};charset=utf8mb4", $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
        $tables = $testPdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $results[] = [
            'cred' => $c['user'] . '@' . $c['name'],
            'success' => true,
            'tables' => $tables
        ];
        break;
    } catch (PDOException $e) {
        $results[] = [
            'cred' => $c['user'] . '@' . $c['name'],
            'pass_hint' => substr($c['pass'], 0, 3) . '***',
            'success' => false,
            'error' => $e->getMessage()
        ];
    }
}

// Check file write in data dir
$dataDir = __DIR__ . '/data';
$dirWritable = is_dir($dataDir) && is_writable($dataDir);
$writeTest = @file_put_contents($dataDir . '/test_write.json', json_encode(['time' => time()]));

echo json_encode([
    'pdo_active' => ($pdo !== null),
    'data_dir_exists' => is_dir($dataDir),
    'data_dir_writable' => $dirWritable,
    'file_write_test' => ($writeTest !== false),
    'mysql_tests' => $results
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
