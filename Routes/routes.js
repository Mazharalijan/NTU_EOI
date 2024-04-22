const CommonController = require("../Controllers/CommonController");
const AuthController = require("../Controllers/AuthController");
const ExpressOfIntresetController = require("../Controllers/ExpressOfIntresetController")
const Proposal = require("../Controllers/ProposalController")
const auth = require("../Middlewares/auth");
const urlError = require("../Middlewares/url-error-handling");
const { request } = require("express");
const router = require("express").Router();


// post routes
router.post('/add-country',CommonController.addCountry);
router.post('/add-partner',CommonController.addPartner);
router.post('/add-assessment-type',CommonController.addAssessmentType);
router.post('/add-consortium-type',CommonController.addConsortiumType);
router.post('/add-express-of-intreset',ExpressOfIntresetController.addEoi)
router.post('/add-proposal',Proposal.addNewProposal)
//get routes
router.get('/all-countries',auth,CommonController.getAllCountry);
router.get('/all-consortium-types',CommonController.getAllConsortiumType);
router.get('/all-assessment-types',CommonController.getAllAssessmentTypes);
router.get('/all-partners',auth,CommonController.getAllPartners);
router.get('/all-express-of-intreset',ExpressOfIntresetController.getAllEoi);
router.get('/all-proposals',Proposal.getAllProposals);
router.get('/one-proposal/:id',Proposal.getSingleProposal);
router.get('/proposal-by-status/:status',Proposal.getProposalByStatus);
router.get('/one-express-of-intreset/:id',ExpressOfIntresetController.getOneEoi);
router.get('/status-express-of-intreset/:status',ExpressOfIntresetController.getStatusEoi);

//put routes

router.put("/update-eoi-status/:id",ExpressOfIntresetController.updateEoiStatus);
router.put("/update-proposal-status/:id",Proposal.updateProposalStatus
);


// Auth routes
router.post('/get-token',AuthController.login);




module.exports = router;

