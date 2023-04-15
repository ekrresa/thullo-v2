import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'

import { db } from '.'

const main = async () => {
  await migrate(db, { migrationsFolder: 'src/db/migrations' }).then(() => {
    console.log('migrations complete')
  })

  process.exit(0)
}

main()
