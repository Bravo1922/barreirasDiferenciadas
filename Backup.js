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

  
  
      // Fechando a conexão com o banco de dados
      await connection.close();
    } catch (err) {
      console.error('Erro ao acessar o banco de dados:', err);
      res.status(500).send("Erro ao acessar o banco de dados");
    }
  }); 
      
    app.post('/createLocation', async function(req, res) {
      const dados = req.body;
      const morada = dados.morada;
      const google_maps_id = dados.google_maps_id;
      const email = dados.email;

  try {
    // Conectando ao banco de dados
    const connection = await oracledb.getConnection(dbConfig);

    // Verificando se o utilizador existe
    const userCheck = await connection.execute(
      `SELECT email FROM Utilizadores WHERE email = :email`,
      [email]
    )
    const moradaCheck = await connection.execute(
        `SELECT morada FROM locais WHERE morada = :morada`,
        [morada]
    );  
    //console.log('AquiNasceuPortugal',userCheck);

    if (userCheck.rows.length === 0) {
      console.log('Utilizador não encontrado');
      res.status(404).send("Utilizador não encontrado");
    } else {
      console.log('Login bem-sucedido:', result.rows[0]);

       // Verificando se o local já foi criado
       if (moradaCheck.rows.length > 0) {
        console.log('Lamentamos. Local já foi criado');
        res.status(409).send("Lamentamos. Local já foi criado");
        } else {
      // Inserindo novo local
        await connection.execute(
          `INSERT INTO Locais (morada,google_maps_id, email_utilizador) VALUES (:morada, 'abc' ,:email)`,
           [morada, email],
          { autoCommit: true }
        );

        console.log('Local criado com sucesso');
        res.status(201).send("Local criado com sucesso");
      }
    }
   
   await connection.close();
  }  catch (err) {
  console.error('Erro ao acessar o banco de dados:', err);
  res.status(500).send("Erro ao acessar o banco de dados");
}
});

      app.post('/addReview', async function(req, res) {
        const dados = req.body;
        const texto = dados.texto;
        const classificacao = dados.classificacao;
        const email = dados.email;
        const idlocal = dados.idlocal;
      
        try {
          // Conectando ao banco de dados
          const connection = await oracledb.getConnection(dbConfig);
      
          // Verificando se o utilizador existe
          const userCheck = await connection.execute(
            `SELECT email FROM Utilizadores WHERE email = :email`,
            [email]
          );
      
          if (userCheck.rows.length === 0) {
            console.log('Utilizador não encontrado');
            res.status(404).send("Utilizador não encontrado");
          } else {
            // Verificando se o local existe
            const locationCheck = await connection.execute(
              `SELECT id FROM Locais WHERE id = :id`,
              [idlocal]
            );
      
            if (locationCheck.rows.length === 0) {
              console.log('Local não encontrado');
              res.status(404).send("Local não encontrado");
            } else {
              // Inserindo nova review
              await connection.execute(
                `INSERT INTO Reviews (texto, classificacao, email_utilizador, idlocal) VALUES (:texto, :classificacao, :email, :idlocal)`,
                [texto, classificacao, email, idlocal],
                { autoCommit: true }
              );
      
              console.log('Review adicionada com sucesso');
              res.status(201).send("Review adicionada com sucesso");
            }
          }
  
      // Fechando a conexão com o banco de dados
      await connection.close();
    } catch (err) {
      console.error('Erro ao acessar o banco de dados:', err);
      res.status(500).send("Erro ao acessar o banco de dados");
    }
  }); 
    
app.listen(6069);
