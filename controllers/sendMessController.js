const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ContentChat = mongoose.model('contentChat');


router.get('/', (req, res) => {
    res.render("index", {
        viewTitle: "Insert Employee"
    });
});
router.post('/registerAccount', (req, res) => {
        insertRecord(req, res);
});
function insertRecord(req, res) {
    var account = new Account();
    account.username = req.body.username;
    account.password = req.body.password;
    account.save((err, doc) => {
        if (!err)
            res.redirect('/');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("index", {
                    viewTitle: "Insert account",
                    account: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

module.exports = router;