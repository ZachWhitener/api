import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import util from 'util';

export default ({ config, db, passport }) => {
	let api = Router();


	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/', (req, res) => {
		res.json({
			data: req.body
		});
	});

	api.get('/auth/login', (req, res) => {
		res.json({ version });
	});


	api.post('/auth/login', (req, res, next) => {
		passport.authenticate('local-login', { session: false }, (err, user, info) => {
			if (err) {
				return res.json({
					success: false
				});
			}

			if (!user) {
				return res.json({
					success: false,
					message: info.message,
					errorNum: 1
				})
			}

			return res.json({
				success: true,
				user: user
			});
		})(req, res, next);


	});

	api.post('/auth/register', (req, res, next) => {
		passport.authenticate('local-signup', { session: false }, (err, user, info) => {
			if (err) {
				return res.json({
					success: false,
					message: info.message
				});
			}

			if (!user) {
				return res.json({
					success: false,
					message: info.message
				});
			}

			return res.json({
				success: true,
				user: user
			});
		})(req, res, next);
	});

	

	return api;
}
