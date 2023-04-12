const travelRoute = {
    Nad: ["Maddilapalem","Gajuwaka"],
    Maddilapalem: ["Madhurawada", "Nad"],
    Madhurawada: ["Kommadi", "Maddilapalem"],
    Kommadi: ["Madhurawada"],
    Gajuwaka:["Nad","Sriharipuram","Anakapalli"],
    Sriharipuram:["Gajuwaka"],
    Anakapalli:["Gajuwaka"]
};

function bfs(src, dest, graph = travelRoute) {
    let queue = [];
    let visited = new Set();
    let previous = new Map();

    queue.push(src);
    visited.add(src);

    while (queue.length > 0) {
        let current = queue.shift();

        if (current === dest) {
            let path = [];
            let prev = current;
            while (prev !== src) {
                path.unshift(prev);

                prev = previous.get(prev);
            }
            path.unshift(src);

            return path;
        }

        for (let neighbor of graph[current]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                previous.set(neighbor, current);
                queue.push(neighbor);
            }
        }
    }

    return [];
}

module.exports = { travelRoute, bfs };