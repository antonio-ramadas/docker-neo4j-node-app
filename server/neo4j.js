
module.exports = new function() {

    const uri = process.env.DB_URI || "bolt://localhost";
    const user = process.env.DB_USER || "neo4j";
    const password = process.env.DB_PASSWORD || "neo4j";

    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    let askDB = (query, params = {}) => {
        const session = driver.session();

        return session.run(query, params).then(
            success => {session.close(); return Promise.resolve(success.records);},
            reject => {session.close(); return Promise.reject(reject);}
        );
    };

    this.listAll = () => {
        return askDB("MATCH (n) RETURN (n)");
    };

    this.listFromCategory = category => {
        const query =
            `
            MATCH ((n)-[*]->(m:category))
            WHERE m.name = $name
            RETURN n
            `;

        const params = {
            name: category
        };

        return askDB(query, params);
    };

    this.close = () => driver.close();
};
