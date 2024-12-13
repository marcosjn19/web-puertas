CREATE TABLE "registros" (
  "id_lectura" int NOT NULL AUTO_INCREMENT,
  "rfid" varchar(10) NOT NULL,
  "fecha_hora" timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  "aprobado" tinyint(1) DEFAULT NULL,
  PRIMARY KEY ("id_lectura")
);

CREATE TABLE "usuarios" (
  "id" int NOT NULL AUTO_INCREMENT,
  "rfid" varchar(10) NOT NULL,
  "user" varchar(50) NOT NULL,
  PRIMARY KEY ("id")
);