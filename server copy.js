var express = require('express');
const oracledb = require("oracledb");

var bodyParser = require('body-parser');
var app = express();

let connection;
    let clientOpts = { libDir: 'c:/oracle/instantclient_21_14' };
    oracledb.initOracleClient(clientOpts);

 let dbConfig = {
        user: "admin",   // TODO CHANGE THIS 
        password: "Iesf-20242024",    // TODO CHANGE THIS 
        connectionString: "bj4lrezvgbyhgmpb_high",    // TODO CHANGE THIS 
      }


//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/login', async function(req, res) {
    const dados = req.body;
    const email = dados.email;
    const password = dados.password;
  
    try {
      // Conectando ao banco de dados
      const connection = await oracledb.getConnection(dbConfig);
  
      // Consulta para verificar as credenciais do utilizador
      const result = await connection.execute(
        `SELECT nome FROM Utilizadores WHERE email = :email AND password = :password`,
        [email, password]
      );
  
      // Verificando se o utilizador foi encontrado
      if (result.rows.length > 0) {
        console.log('Login bem-sucedido:', result.rows[0]);
        res.status(200).send("Login com sucesso");
      } else {
        console.log('Credenciais inválidas');
        res.status(401).send("Credenciais inválidas");
      }
  
      // Fechando a conexão com o banco de dados
      await connection.close();
    } catch (err) {
      console.error('Erro ao acessar o banco de dados:', err);
      res.status(500).send("Erro ao acessar o banco de dados");
    }
  });


  app.post('/signup', async function(req, res) {
    const dados = req.body;
    const email = dados.email;
    const nome = dados.nome;
    const password = dados.password;
  
    try {
      // Conectando ao banco de dados
      const connection = await oracledb.getConnection(dbConfig);
  
      // Consulta para verificar se o email já existe
      const emailCheck = await connection.execute(
        `SELECT email FROM Utilizadores WHERE email = :email`,
        [email]
      );
  
      // Verificando se o email já está em uso
      if (emailCheck.rows.length > 0) {
        console.log('Email já está em uso');
        res.status(409).send("Email já está em uso");
      } else {
        // Inserindo novo utilizador
        await connection.execute(
          `INSERT INTO Utilizadores (email, nome, password) VALUES (:email, :nome, :password)`,
          [email, nome, password],
          { autoCommit: true }
        );
  
        console.log('Registo bem-sucedido');
        res.status(201).send("Registo bem-sucedido");
      }
    app.post('/createLocation', async function(req, res) {
      const dados = req.body;
      const morada = dados.morada;
      //const google_maps_id = dados.google_maps_id;
      const email_utilizador = dados.email_utilizador;



  try {
    // Conectando ao banco de dados
    const connection = await oracledb.getConnection(dbConfig);

    // Verificando se o utilizador existe
    const userCheck = await connection.execute(
      `SELECT email FROM Utilizadores WHERE email = :email`,
      [email_utilizador]
    );

    if (userCheck.rows.length === 0) {
      console.log('Utilizador não encontrado');
      res.status(404).send("Utilizador não encontrado");
    } else {
      // Inserindo novo local
        await connection.execute(
          `INSERT INTO Locais (morada,, email_utilizador) VALUES (:morada, :email_utilizador)`,
           [morada, email_utilizador],
          { autoCommit: true }
        );

        console.log('Local criado com sucesso');
        res.status(201).send("Local criado com sucesso");
      }

  
      // Fechando a conexão com o banco de dados
      await connection.close();
    } catch (err) {
      console.error('Erro ao acessar o banco de dados:', err);
      res.status(500).send("Erro ao acessar o banco de dados");
    }
  }); 

app.listen(6069);
