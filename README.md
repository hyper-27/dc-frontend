Frontend Files Issues & Solutions

Frontend AxiosError: Request failed with status code 400 during Login/Registration:
Diagnosis/Solution: Frontend AuthContext or login/register components not sending Content-Type: application/json header.

Frontend console showed AxiosError: 400 but Network tab showed 200 OK for calculate-scores:
Diagnosis/Solution: Console error was stale; the actual problem was scores displaying as 0 on frontend due to missing backend data.

Scores not displaying or updating correctly on frontend after calculate-scores returned non-zero values:
Diagnosis/Solution: Frontend's DecisionEditPage.jsx needed to correctly update options and decision.overallScore states with the received data.

Lack of user input mechanism for individual alternative-criterion ratings:
Diagnosis/Solution: Implemented the "Ratings" input table UI, handleRatingChange, and handleSaveRatings logic in src/pages/DecisionEditPage.jsx.





Okay, here's the separated list of issues and their one-liner diagnosis/solution, categorized by Frontend and Backend files:

Frontend Files Issues & Solutions
Frontend AxiosError: Request failed with status code 400 during Login/Registration:
Diagnosis/Solution: Frontend AuthContext or login/register components not sending Content-Type: application/json header.
Frontend console showed AxiosError: 400 but Network tab showed 200 OK for calculate-scores:
Diagnosis/Solution: Console error was stale; the actual problem was scores displaying as 0 on frontend due to missing backend data.
Scores not displaying or updating correctly on frontend after calculate-scores returned non-zero values:
Diagnosis/Solution: Frontend's DecisionEditPage.jsx needed to correctly update options and decision.overallScore states with the received data.
Lack of user input mechanism for individual alternative-criterion ratings:
Diagnosis/Solution: Implemented the "Ratings" input table UI, handleRatingChange, and handleSaveRatings logic in src/pages/DecisionEditPage.jsx.
Backend Files Issues & Solutions
Initial Login/Registration Backend Errors (e.g., 400 Bad Request, 500 Internal Server Error):
Diagnosis/Solution: Backend authController.js needed correct data validation, user creation, and proper error handling/responses.
Backend calculate-scores endpoint returning 400 Bad Request:
Diagnosis/Solution: decisionController.js required robust validation for alternatives and criteria arrays before attempting calculations.
Calculated scores were always 0 on the backend, even with 200 OK status:
Diagnosis/Solution: decisionController.js's calculateScores relied on Rating documents, but no mechanism existed to save these ratings in the database.
ReferenceError: addAlternative is not defined in backend/routes/decisionRoutes.js:
Diagnosis/Solution: addAlternative (and other CRUD functions for subdocuments) were missing from/not exported by decisionController.js when the file was replaced.
Lack of user input mechanism for individual alternative-criterion ratings (Backend Part):
Diagnosis/Solution: Created Rating Mongoose model and implemented addRatings/getRatings in decisionController.js with corresponding API routes in decisionRoutes.js.


Backend Files Issues & Solutions


Initial Login/Registration Backend Errors (e.g., 400 Bad Request, 500 Internal Server Error):
Diagnosis/Solution: Backend authController.js needed correct data validation, user creation, and proper error handling/responses.

Backend calculate-scores endpoint returning 400 Bad Request:
Diagnosis/Solution: decisionController.js required robust validation for alternatives and criteria arrays before attempting calculations.

Calculated scores were always 0 on the backend, even with 200 OK status:
Diagnosis/Solution: decisionController.js's calculateScores relied on Rating documents, but no mechanism existed to save these ratings in the database.

ReferenceError: addAlternative is not defined in backend/routes/decisionRoutes.js:
Diagnosis/Solution: addAlternative (and other CRUD functions for subdocuments) were missing from/not exported by decisionController.js when the file was replaced.

Lack of user input mechanism for individual alternative-criterion ratings (Backend Part):
Diagnosis/Solution: Created Rating Mongoose model and implemented addRatings/getRatings in decisionController.js with corresponding API routes in decisionRoutes.js.