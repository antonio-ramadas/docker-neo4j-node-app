
module.exports = new function() {

    const uri = process.env.DB_URI || "bolt://localhost:7687";
    const user = process.env.DB_USER || "neo4j";
    const password = process.env.DB_PASSWORD || "neo4j";

    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    let askDB = (query, params = {}) => {
        const session = driver.session();

        return session.run(query, params).then(
            success => {session.close(); return Promise.resolve(success);},
            reject => {session.close(); return Promise.reject(reject);}
        ).then(data => {
            data = data.records.map(elem => {
                return {
                    name: elem.get("name"),
                    category: elem.get("category")
                };
            });

            data.sort((lhs, rhs) => (lhs.category > rhs.category) - (lhs.category < rhs.category));

            return Promise.resolve(data);
        });
    };

    this.listAll = () => {
        const query = `
            MATCH (n)
            RETURN labels(n)[0] AS category, n.name AS name
        `;

        return askDB(query);
    };

    this.listFromCategory = category => {
        const query = `
            MATCH ((n)-[*]->(m:category))
            WHERE m.name = $name
            RETURN labels(n)[0] AS category, n.name AS name
        `;

        const params = {
            name: category
        };

        return askDB(query, params);
    };

    this.close = () => driver.close();
};
