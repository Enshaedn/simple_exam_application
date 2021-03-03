This project was created as a coding challenge. It is not entirely completed and is provided as is - with minimal CSS, refactoring, and/or testing. The project uses React, ColdFusion, and MySQL for the stack. 

To use, the React app must be kept in the ColdFusion folder, wwwroot. This is so that the cfc files will run on the CF server via the public folder of the app. Sample path C:\ColdFusion2021\cfusion\wwwroot\exam_demo

ColdFusion data source named ntn_demo.

The database is setup as such:

CREATE DATABASE ntn_demo;

CREATE TABLE admins (
	adminID INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    adminCreated DATETIME NOT NULL,
    PRIMARY KEY (adminID),
    UNIQUE (adminID, username)
);

CREATE TABLE tests (
	testID INT NOT NULL AUTO_INCREMENT,
    testName VARCHAR(100),
    testCreated DATETIME NOT NULL,
    testUpdated DATETIME NOT NULL,
    PRIMARY KEY (testID),
    UNIQUE (testID)
);

CREATE TABLE testAdmins(
	adminID INT NOT NULL,
    testID INT NOT NULL,
    PRIMARY KEY (adminID, testID)
);

CREATE TABLE questions (
	questionID INT NOT NULL AUTO_INCREMENT,
    testID INT NOT NULL,
    adminID INT NOT NULL,
    question VARCHAR(255) NOT NULL,
    questionType ENUM(
		'TextEntry',
        'MultipleChoice',
        'TrueFalse',
        'NumberEntry'
	) NOT NULL,
    numOptions INT,
    questionCreated DATETIME NOT NULL,
    questionUpdated DATETIME NOT NULL,
    PRIMARY KEY (questionID),
    FOREIGN KEY (testID) REFERENCES tests(testID) ON DELETE CASCADE,
    UNIQUE (questionID)
);

CREATE TABLE questionOptions (
	optionID INT NOT NULL AUTO_INCREMENT,
    questionID INT NOT NULL,
    optionValue VARCHAR(100) NOT NULL,
    isCorrect BOOLEAN NOT NULL,
    optionOrder INT,
    optionCreated DATETIME NOT NULL,
    optionUpdated DATETIME NOT NULL,
    PRIMARY KEY (optionID),
    FOREIGN KEY (questionID) REFERENCES questions(questionID) ON DELETE CASCADE,
    UNIQUE (optionID)
);