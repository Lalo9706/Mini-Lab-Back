import { postgresPool } from "../src/infrastructure/database/postgres.pool.js";
import { hashPassword, isArgon2Hash } from "../src/shared/security/password.service.js";

interface EmployeePasswordRow {
  id_empleado: number;
  contrasenia: string;
}

async function migratePasswords(): Promise<void> {
  const applyChanges = process.argv.includes("--apply");

  const client = await postgresPool.connect();

  let transactionStarted = false;

  try {
    await client.query("BEGIN");
    transactionStarted = true;

    const result = await client.query<EmployeePasswordRow>(`
      SELECT id_empleado, contrasenia
      FROM empleado
      ORDER BY id_empleado
      FOR UPDATE
    `);

    const pending: EmployeePasswordRow[] = [];
    let alreadyHashed = 0;

    for (const employee of result.rows) {
      if (isArgon2Hash(employee.contrasenia)) {
        alreadyHashed++;
        continue;
      }

      // No intentaremos convertir hashes de otros algoritmos
      // como si fueran contraseñas en texto plano.
      if (employee.contrasenia.startsWith("$")) {
        throw new Error("Se detectaron hashes de formato desconocido. Migración cancelada.");
      }

      pending.push(employee);
    }

    if (!applyChanges) {
      await client.query("ROLLBACK");
      transactionStarted = false;

      console.log("MODO DRY RUN: no se modificó la base de datos.");
      console.log(`Contraseñas que requieren migración: ${pending.length}`);
      console.log(`Contraseñas Argon2 existentes: ${alreadyHashed}`);

      return;
    }

    for (const employee of pending) {
      const passwordHash = await hashPassword(employee.contrasenia);

      await client.query(
        `
        UPDATE empleado
        SET contrasenia = $1
        WHERE id_empleado = $2
        `,
        [passwordHash, employee.id_empleado],
      );
    }

    await client.query("COMMIT");
    transactionStarted = false;

    console.log("Migración completada.");
    console.log(`Contraseñas migradas: ${pending.length}`);
    console.log(`Contraseñas previamente cifradas mediante hash: ${alreadyHashed}`);
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }

    throw error;
  } finally {
    client.release();
    await postgresPool.end();
  }
}

migratePasswords().catch((error: unknown) => {
  console.error(
    "Error durante la migración:",
    error instanceof Error ? error.message : "Error desconocido",
  );

  process.exitCode = 1;
});
