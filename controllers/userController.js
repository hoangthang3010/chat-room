const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('account');

router.get('/', (req, res) => {
    res.render("index", {
        viewTitle: "Insert Employee"
    });
});
router.post('/registerAccount', (req, res) => {
    // if (req.body.username == '')
        insertRecord(req, res);
        // else
        // updateRecord(req, res);
});

router.get('/registerAccount', function (req, res) {
    res.render("registerAccount", {
        viewTitle: "Insert Employee"
    });
  })

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

// router.get('/registerAccount', (req, res) => {
//     Employee.find((err, docs) => {
//         if (!err) {
//             res.render("/registerAccount", {
//                 list: docs
//             });
//         }
//         else {
//             console.log('Error in retrieving employee list :' + err);
//         }
//     });
// });


module.exports = router;