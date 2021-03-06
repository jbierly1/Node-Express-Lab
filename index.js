// import your node modules
const express = require('express');
const server = express();

const db = require('./data/db.js');

server.use(express.json());

// add your server code starting here

server.get('/api/posts', (req, res) => {
	db.find()
		.then(posts => {
			res.status(200).json(posts);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'The posts information could not be retrieved.' });
		});
});

server.get('/api/posts/:id', (req, res) => {
	console.log('got something');
	let { id } = req.params;
	db.findById(id)
		.then(post => {
			if (post) {
				res.json(post);
			} else {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' });
			}
			res.status(200).json(post);
		})
		.catch(err => {
			res
				.status(500)
				.json({ error: 'The post information could not be retrieved.' });
		});
});

server.delete('/api/delete_posts/:id', (req, res) => {
	let { id } = req.params;

	db.findById(id).then(post => {
		db.remove(id)
			.then(
				post
					? res.status(200).json(post)
					: res.status(404).json({
							message: 'The post with the specified ID does not exist.'
					  })
			)
			.catch(res.status(500).json({ error: 'The post could not be removed' }));
	});
});

server.post('/api/posts', (req, res) => {
	const post = req.body;

	if (post.title && post.contents) {
		db.insert(post)
			.then(postId => {
				db.getById(postId).then(newpost => {
					post = newpost;
				});
			})
			.then(res.status(201).json(post))
			.catch(err => {
				res.status(500).json({
					error: 'There was an error while saving the post to the database'
				});
			});
	} else {
		res.status(400).json({
			errorMessage: 'Please provide title and contents for the post.'
		});
	}
});

server.put('/api/put_posts/:id', (req, res) => {
	const updatedPost = req.body;
	let { id } = req.params;

	if (updatedPost.title && updatedPost.contents) {
		//
		console.log('id' + id);
		console.log('updated post' + updatedPost.title + updatedPost.contents);
		db.update(id, updatedPost).then(number => {
			console.log(number);
			if (!number) {
				res.status(404).json({
					error: 'The post with the specified ID does not exist'
				});
			} else {
				db.findById(id).then(successfullyUpdatedPost => {
					res.status(200).json(successfullyUpdatedPost[0]);
				});
			}
		});
		// .catch(
		// 	res.status(500).json({
		// 		error: 'The post information could not be modified.'
		// 	})
		// );
	} else {
		res.status(400).json({
			errorMessage: 'Please provide title and contents for the post.'
		});
	}
});

server.listen(8000, () => console.log('API running on port 8000'));
