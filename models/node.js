var mongoose = require('mongoose');

// Node Schema
var NodeSchema = mongoose.Schema({
	title: String,
	data: mongoose.Schema.Types.Mixed,
	edges: [
		mongoose.Schema.Types.ObjectId
	]
});


const node = module.exports = mongoose.model("node", NodeSchema)

// Most important operations for the node - create a node, create a vertex, retrieve the node, delete (? delete the vertices and remove from the neighors - how to find )
/*
	When vertex is blank, add special char for data, vertexDefault name is the Title1/Title2
	Return the default strcutue
*/

// Creating a node / vertex
module.exports.createNode = (data, callback) => {
	node.create(data, callback);
};

// Find Node by param
module.exports.findNode = (queryObject, callback) => {
	node.find(queryObject, callback);
};

// Update Node
module.exports.evolve = (updatedObject, callback) => {
	node.updateOne({_id:updatedObject._id}, updatedObject, callback);
}

// Delete !
module.exports.deleteNode = (queryObject, callback) => {
	// Find the node and find all connections, and go to the other one and update
	node.findNode(queryObject, (err, data) => {
		if (err) throw err;
		if (!data[0]) {
			vertexes = [];
		} else {
			vertexes = data[0].edges;
		}
		vertexes.forEach(vertex => {
			console.log(vertex);
			// Find which edge is the correct one
			if (vertex.edges[0] == data._id) {
				// The second one is, find that guy
				removeItsEdge(vertex, 1);
			} else {
				// it's the first guy
				removeItsEdge(vertex, 0);
			}
			// The neighbor is updated, delete this conn.
			Node.deleteOne(vertex._id, (verr) => {
				if (verr) throw verr;
				// Success!
				console.log('safest!');
			})
		});
	})
	// The deletion is safe!
	node.deleteOne(queryObject, callback);
}

function removeItsEdge(vertex, i) {
	// Find the vertex's other neighbor
	node.findNode({ _id: vertex.edges[i] }, (err, data) => {
		if (err) throw err;
		// Remove this conn.
		ndata.edges.splice(ndata.edges.indexOf(vertex));
		// Update it
		node.evolve(ndata, (uerr, udata) => {
			if (uerr) throw uerr;
			// Safe
			console.log('safe');
		})
	});
}

