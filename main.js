const {
  ToadScheduler,
  SimpleIntervalJob,
  AsyncTask,
} = require('toad-scheduler')
const sql = require('mssql')
const fs = require('fs/promises')

const scheduler = new ToadScheduler()

const BACKUP_FOLDER = 'backups'

const backupDB = async () => {
  // Delete old backups if more than 10
  const files = await fs
    .readdir(`./${BACKUP_FOLDER}`)
    .then((files) => files.sort())
  if (files.length > 10)
    await Promise.all(
      files
        .slice(0, files.length - 10)
        .map((fileName) => fs.rm(`./${BACKUP_FOLDER}/${fileName}`))
    )

  const config = {
    user: 'sa',
    password: 'Yieldxbiz2021',
    server: 'localhost',
    database: 'yx_rm',
    options: { encrypt: false },
  }
  await sql
    .connect(config)
    .then(() =>
      new sql.Request().query(`
BACKUP DATABASE yx_rm
TO DISK = N'${__dirname}\\${BACKUP_FOLDER}\\yx_rm_${Date.now()}.bak'
WITH CHECKSUM
    `)
    )
    .then(() => {
      sql.close()
      console.log('backup success')
    })
}

const task = new AsyncTask('Backup DB', backupDB, (err) => {
  console.log(err)
})
const job = new SimpleIntervalJob({ minutes: 30 }, task)

scheduler.addSimpleIntervalJob(job)
