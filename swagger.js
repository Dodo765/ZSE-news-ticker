/**
 * @swagger
 *
 * /show:
 *   post:
 *     tags:
 *       - PASKI
 *     summary: Włącz widoczność pasków informacyjnych (Pokaż paski)
 *     description: Ustawia stan pasków informacyjnych na widoczny.
 *     responses:
 *       200:
 *         description: Sukces, włączono widoczność
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poprawnie pokazano paski"
 * 
 * /hide:
 *   post:
 *     tags:
 *       - PASKI
 *     summary: Wyłącz widoczność pasków informacyjnych (Ukryj paski)
 *     description: Ustawia stan pasków informacyjnych na niewidoczny (ukryty).
 *     responses:
 *       200:
 *         description: Sukces, wyłączono widoczność
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poprawnie ukryto paski"
 * 
 * /logo/show:
 *   post:
 *     tags:
 *       - LOGO PARTNERA
 *     summary: Włącz widoczność loga partnera (Pokaż logo)
 *     description: Ustawia stan loga partnera na widoczny.
 *     responses:
 *       200:
 *         description: Sukces, włączono widoczność
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poprawnie pokazano logo partnera"
 * 
 * /logo/hide:
 *   post:
 *     tags:
 *       - LOGO PARTNERA
 *     summary: Wyłącz widoczność loga partnera (Ukryj logo)
 *     description: Ustawia stan loga partnera na niewidoczny (ukryty).
 *     responses:
 *       200:
 *         description: Sukces, wyłączono widoczność
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poprawnie ukryto logo partnera"
 * 
 * /dots/show:
 *   post:
 *     tags:
 *       - KROPKI
 *     summary: Włącz widoczność kropek między wierszami (Pokaż kropki)
 *     description: Ustawia stan kropek między wierszami na widoczny.
 *     responses:
 *       200:
 *         description: Sukces, włączono widoczność
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poprawnie pokazano kropki między paskami"
 * 
 * /dots/hide:
 *   post:
 *     tags:
 *       - KROPKI
 *     summary: Wyłącz widoczność kropek między wierszami (Ukryj kropki)
 *     description: Ustawia stan kropek między wierszami na niewidoczny (ukryty).
 *     responses:
 *       200:
 *         description: Sukces, wyłączono widoczność
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Poprawnie ukryto kropki między paskami"
 */