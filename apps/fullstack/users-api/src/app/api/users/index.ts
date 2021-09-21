import { Router } from 'express';
// import Model, { Project } from "@creativearis/models";
import Model from './model';
// import { removeOne, update } from '../utils/methods';
// import { User } from '@mussia12/shared/mongoose-schemas';
//
const route = Router();
/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Service1
 *     name: Find Service1
 *     summary: Finds Service1 information
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: projection
 *         type: string
 *         required: false
 *         description: Array or string with spaces projection keys to fetch
 *         example: email role
 *       - in: query
 *         name: email
 *         type: string
 *         description: Search by email
 *     responses:
 *       200:
 *         description: A single project object
 *         content:
 *             application/json:
 *               type: array
 *               schema:
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *
 *       401:
 *         description: No auth token
 *       500:
 *         description: Error happened
 */
route.get('/', (req, res) => {
  const { projection } = req.query;
  // console.log("req.query before", req.query);
  delete req.query.projection;
  // console.log("Models", Models);
  // res.status(200).json({ ok: true });
  // console.log("req.query after", req.query);
  Model.find(req.query, projection)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Service1
 *     name: Find service1 by id
 *     summary: Finds by id
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: projection
 *         type: string
 *         required: false
 *         description: Array or string with spaces projection keys to fetch
 *     responses:
 *       200:
 *         description: A single user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *                  {
 *                      _id: "das",
 *                      email: "ds@ds.com",
 *                      isActive: true,
 *                      firstName: Aris,
 *                      lastName: "Krupnik",
 *                      password: "123456",
 *                      provider: local,
 *                      token: "",
 *                      role: admin
 *                  }
 *       401:
 *         description: No auth token
 *       500:
 *         description: No item found
 */
route.get('/:id', (req, res) => {
  Model.findById(req.params.id, req.query.projection)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Service1
 *     name: Find service1 by id
 *     summary: Creates service1 information
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *              editor:
 *                value:
 *                  email: editor@a.com
 *                  password: "123456"
 *                  role: editor
 *              finance:
 *                value:
 *                  email: finance@a.com
 *                  password: "123456"
 *                  role: finance
 *              google:
 *                value:
 *                  email: finance@a.com
 *                  password: "123456"
 *                  provider: google
 *              github:
 *                value:
 *                  email: finance@a.com
 *                  password: "123456"
 *                  provider: github
 *     responses:
 *       201:
 *         description: A single project object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No auth token
 */
route.post('/', (req, res) => {
  console.log('req', req.body); // eslint-disable-line
  const { projection } = req.body;
  delete req.body.projection;
  Model.create(req.body, projection)
    .then((entity) => {
      res.status(201).json(entity);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     tags:
 *       - Service1
 *     name: Delete service1 by id
 *     summary: Delete service1 information
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required:
 *           - id
 *     responses:
 *       202:
 *         description: A single project object
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       401:
 *         description: No auth token
 */
// route.delete('/:id', removeOne(Model));

/**
 * @swagger
 * /:
 *   put:
 *     tags:
 *       - Service1
 *     name: Update
 *     summary: Update service1 information
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Optional description in *Markdown*
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *              editor:
 *                value:
 *                  _id: ''
 *                  role: editor
 *              finance:
 *                value:
 *                  _id: ''
 *                  role: finance
 *              google:
 *                value:
 *                  email: finance@a.com
 *                  password: "123456"
 *                  provider: google
 *              github:
 *                value:
 *                  email: finance@a.com
 *                  password: "123456"
 *                  provider: github
 *     responses:
 *       200:
 *         description: A single project object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No auth token
 */
// route.put('/', update(Model));
// route.delete("/", (req, res) => {
//     res.status(200).json({
//         message: "removed many"
//     });
// }); // remove many
route.post('/buss', (req, res) => {
  console.log('req', req.body);
  res.status(200).json({ ok: 'yes' });
});
export default route;
