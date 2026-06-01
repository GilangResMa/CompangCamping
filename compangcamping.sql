-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Bulan Mei 2026 pada 02.03
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `compangcamping`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Tenda', 'Peralatan tenda camping', '2026-05-24 15:23:15'),
(2, 'Carrier', 'Tas gunung', '2026-05-24 15:23:15'),
(3, 'Alat Masak', 'Peralatan memasak outdoor', '2026-05-24 15:23:15');

-- --------------------------------------------------------

--
-- Struktur dari tabel `fines`
--

CREATE TABLE `fines` (
  `id` int(11) NOT NULL,
  `rental_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('unpaid','paid') DEFAULT 'unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `fines`
--

INSERT INTO `fines` (`id`, `rental_id`, `amount`, `reason`, `created_at`, `status`) VALUES
(2, 4, 10000.00, 'telat', '2026-05-26 14:13:18', 'paid'),
(3, 7, 10000.00, 'rusak ringan, sobek dikit', '2026-05-28 04:30:10', 'unpaid'),
(4, 12, 20000.00, 'resleting rusak saat dikembalikan', '2026-05-28 06:17:35', 'paid');

-- --------------------------------------------------------

--
-- Struktur dari tabel `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `item_condition` enum('baik','rusak_ringan','rusak_berat','hilang') DEFAULT 'baik',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_unit` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `items`
--

INSERT INTO `items` (`id`, `name`, `category_id`, `description`, `price_per_day`, `stock`, `item_condition`, `created_at`, `total_unit`) VALUES
(1, 'Tenda Dome 4 Orang', 1, 'Tenda kapasitas 4 orang', 50000.00, 0, 'baik', '2026-05-24 15:23:15', 0),
(2, 'Carrier 60L', 2, 'Tas gunung ukuran 60 liter', 35000.00, 7, 'rusak_ringan', '2026-05-24 15:23:15', 0),
(4, 'Kompor Portable', 3, 'kompor portable, mudah', 25000.00, 6, 'baik', '2026-05-27 16:10:34', 0),
(5, 'Tenda 1 orang', 1, 'Tenda dengan kapasitas 1 orang', 30000.00, 1, 'baik', '2026-05-28 04:31:46', 0),
(6, 'Tenda 2 orang', 1, 'Tenda kapasitas 2 orang', 40000.00, 4, 'baik', '2026-05-28 06:52:14', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `item_conditions`
--

CREATE TABLE `item_conditions` (
  `id` int(11) NOT NULL,
  `rental_id` int(11) DEFAULT NULL,
  `item_id` int(11) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `photo_url` text DEFAULT NULL,
  `condition_before` varchar(100) DEFAULT NULL,
  `condition_after` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `item_units`
--

CREATE TABLE `item_units` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `unit_code` varchar(100) NOT NULL,
  `condition_status` enum('baik','rusak_ringan','rusak_berat','hilang') DEFAULT 'baik',
  `availability_status` enum('available','rented','maintenance','lost') DEFAULT 'available',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `item_units`
--

INSERT INTO `item_units` (`id`, `item_id`, `unit_code`, `condition_status`, `availability_status`, `notes`, `created_at`) VALUES
(10, 5, 'tenda-1', 'baik', 'rented', NULL, '2026-05-28 04:32:28'),
(11, 5, 'TENDA-1-ORANG-001', 'baik', 'available', NULL, '2026-05-28 06:51:28'),
(12, 5, 'TENDA-1-ORANG-002', 'baik', 'available', NULL, '2026-05-28 06:51:28'),
(13, 6, 'TENDA-2-ORANG-001', 'baik', 'available', NULL, '2026-05-28 06:52:14'),
(14, 6, 'TENDA-2-ORANG-002', 'baik', 'available', NULL, '2026-05-28 06:52:14'),
(15, 6, 'TENDA-2-ORANG-003', 'baik', 'available', NULL, '2026-05-28 06:52:14'),
(16, 6, 'TENDA-2-ORANG-004', 'baik', 'available', NULL, '2026-05-28 06:52:14'),
(17, 2, 'CARRIER-60L-001', 'baik', 'available', NULL, '2026-05-28 23:55:15'),
(18, 2, 'CARRIER-60L-002', 'baik', 'available', NULL, '2026-05-28 23:55:15'),
(19, 2, 'CARRIER-60L-003', 'baik', 'available', NULL, '2026-05-28 23:55:15'),
(20, 4, 'KOMPOR-PORTABLE-001', 'baik', 'rented', NULL, '2026-05-28 23:55:27'),
(21, 4, 'KOMPOR-PORTABLE-002', 'baik', 'available', NULL, '2026-05-28 23:55:27'),
(22, 4, 'KOMPOR-PORTABLE-003', 'baik', 'available', NULL, '2026-05-28 23:55:27'),
(23, 1, 'TENDA-DOME-4-ORANG-001', 'baik', 'available', NULL, '2026-05-28 23:55:41'),
(24, 1, 'TENDA-DOME-4-ORANG-002', 'baik', 'available', NULL, '2026-05-28 23:55:41'),
(25, 1, 'TENDA-DOME-4-ORANG-003', 'baik', 'available', NULL, '2026-05-28 23:55:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rentals`
--

CREATE TABLE `rentals` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rental_date` date NOT NULL,
  `return_date` date NOT NULL,
  `actual_return_date` datetime DEFAULT NULL,
  `status` enum('pending','active','returned','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rentals`
--

INSERT INTO `rentals` (`id`, `user_id`, `rental_date`, `return_date`, `actual_return_date`, `status`, `created_at`) VALUES
(1, 2, '2026-05-25', '2026-05-27', '2026-05-25 13:52:52', 'returned', '2026-05-25 05:15:33'),
(2, 4, '2026-05-25', '2026-05-26', '2026-05-25 13:52:52', 'returned', '2026-05-25 05:39:34'),
(3, 4, '2026-05-27', '2026-05-29', '2026-05-25 13:52:51', 'returned', '2026-05-25 05:41:31'),
(4, 3, '2026-05-25', '2026-05-26', '2026-05-26 22:54:54', 'returned', '2026-05-25 05:47:28'),
(7, 3, '2026-05-29', '2026-05-30', '2026-05-28 08:57:05', 'returned', '2026-05-28 01:54:48'),
(10, 3, '2026-05-30', '2026-05-31', NULL, 'cancelled', '2026-05-28 04:35:46'),
(11, 4, '2026-05-29', '2026-05-30', '2026-05-28 13:35:19', 'returned', '2026-05-28 04:59:19'),
(12, 5, '2026-05-28', '2026-05-29', '2026-05-28 13:17:40', 'returned', '2026-05-28 06:15:30'),
(13, 5, '2026-05-29', '2026-05-30', NULL, 'active', '2026-05-28 23:56:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rental_items`
--

CREATE TABLE `rental_items` (
  `id` int(11) NOT NULL,
  `rental_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rental_items`
--

INSERT INTO `rental_items` (`id`, `rental_id`, `item_id`, `quantity`, `created_at`) VALUES
(1, 1, 1, 1, '2026-05-25 05:15:33'),
(2, 2, 1, 2, '2026-05-25 05:39:34'),
(4, 3, 1, 1, '2026-05-25 05:41:31'),
(5, 4, 1, 1, '2026-05-25 05:47:28'),
(6, 7, 2, 1, '2026-05-28 01:54:48'),
(8, 10, 5, 1, '2026-05-28 04:35:46'),
(9, 10, 2, 1, '2026-05-28 04:35:46'),
(10, 11, 4, 1, '2026-05-28 04:59:19'),
(11, 12, 2, 1, '2026-05-28 06:15:30'),
(12, 13, 5, 1, '2026-05-28 23:56:10'),
(13, 13, 4, 1, '2026-05-28 23:56:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rental_units`
--

CREATE TABLE `rental_units` (
  `id` int(11) NOT NULL,
  `rental_id` int(11) NOT NULL,
  `unit_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `rental_units`
--

INSERT INTO `rental_units` (`id`, `rental_id`, `unit_id`, `created_at`) VALUES
(3, 10, 10, '2026-05-28 04:35:46'),
(7, 13, 10, '2026-05-28 23:56:10'),
(8, 13, 20, '2026-05-28 23:56:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('owner','renter') DEFAULT 'renter',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `phone`, `role`, `created_at`) VALUES
(2, 'admin@gmail.com', '$2a$10$Q2CGV3fKMcELSIHo9v0Gt.UQr6I9ug3mhPq8/97A5gkiCaC5e0LoK', 'Admin Camping', '08123456789', 'owner', '2026-05-24 15:13:28'),
(3, 'najib@gmail.com', '$2a$10$g0N.CfwdCG.GGSq8wT4dqO7iLEl3tIiN7MzRNk2FQXbd7QlCYSrM6', 'Najib', '08123456789', 'renter', '2026-05-25 05:19:15'),
(4, 'fadhil@gmail.com', '$2a$10$T18x7R0yljphw81h4qr2oODtvIPz5VAkrhRLar4p9bSbHcW/5tCrS', 'fadhil', '08596325', 'renter', '2026-05-25 05:30:49'),
(5, 'user@gmail.com', '$2a$10$hit64wyvB7Ggg0yb.wsP1uq82.neINcMnsh0YhXDsGJS4jUT4DsNC', 'userContoh', '12456852', 'renter', '2026-05-28 06:14:53');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `fines`
--
ALTER TABLE `fines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_id` (`rental_id`);

--
-- Indeks untuk tabel `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `item_conditions`
--
ALTER TABLE `item_conditions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_id` (`rental_id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `fk_item_conditions_unit` (`unit_id`);

--
-- Indeks untuk tabel `item_units`
--
ALTER TABLE `item_units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unit_code` (`unit_code`),
  ADD KEY `item_id` (`item_id`);

--
-- Indeks untuk tabel `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `rental_items`
--
ALTER TABLE `rental_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_id` (`rental_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indeks untuk tabel `rental_units`
--
ALTER TABLE `rental_units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_id` (`rental_id`),
  ADD KEY `unit_id` (`unit_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `fines`
--
ALTER TABLE `fines`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `item_conditions`
--
ALTER TABLE `item_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `item_units`
--
ALTER TABLE `item_units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT untuk tabel `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `rental_items`
--
ALTER TABLE `rental_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT untuk tabel `rental_units`
--
ALTER TABLE `rental_units`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `fines`
--
ALTER TABLE `fines`
  ADD CONSTRAINT `fines_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`);

--
-- Ketidakleluasaan untuk tabel `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Ketidakleluasaan untuk tabel `item_conditions`
--
ALTER TABLE `item_conditions`
  ADD CONSTRAINT `fk_item_conditions_unit` FOREIGN KEY (`unit_id`) REFERENCES `item_units` (`id`),
  ADD CONSTRAINT `item_conditions_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  ADD CONSTRAINT `item_conditions_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Ketidakleluasaan untuk tabel `item_units`
--
ALTER TABLE `item_units`
  ADD CONSTRAINT `item_units_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Ketidakleluasaan untuk tabel `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `rental_items`
--
ALTER TABLE `rental_items`
  ADD CONSTRAINT `rental_items_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  ADD CONSTRAINT `rental_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Ketidakleluasaan untuk tabel `rental_units`
--
ALTER TABLE `rental_units`
  ADD CONSTRAINT `rental_units_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  ADD CONSTRAINT `rental_units_ibfk_2` FOREIGN KEY (`unit_id`) REFERENCES `item_units` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
