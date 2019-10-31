// category, value, unit, name, userId
// 'Weight', '60', 'kg', 'Jane Doe', '123456789',




module.exports = {
  url: 'http://localhost:3000/goals',
  commands: [{

    verifyElements: function() {
      return this
        .waitForElementPresent('#goalsPage', 10000)
        .verify.elementPresent('#goalsTable');
    },
    verifyEmptyList: function() {
      return this
        .verify.elementNotPresent('#goalsTable .goalRow:nth-child(1)');
    },
    verifyGoalListCard: function() {
      return this
        .verify.elementPresent('#goalsTable')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(1)')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(1) .description')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(1) .priority')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(1) .status');
    },
    selectNewGoalTab: function() {
      return this
        .verify.elementPresent('#goalsPageTabs')
        .verify.elementPresent('#goalsPageTabs .newGoalTab')
        .click("#goalsPageTabs .newGoalTab");
    },
    verifyNewGoalCard: function() {
      return this
        .verify.elementPresent('#goalsPage .goalDetail')
        .verify.elementPresent('#goalsPage .goalDetail input[name="description"]')
        .verify.elementPresent('#goalsPage .goalDetail input[name="priority"]')
        .verify.elementPresent('#goalsPage .goalDetail input[name="status"]')
    },
    verifyGoalDetails: function(description, priority, status) {
      this
        .waitForElementPresent('#goalDetails', 5000);

      if (description) {
        this.verify.attributeEquals('#goalsPage .goalDetail  input[name="description"]', 'value', description);
      }
      if (priority) {
        this.verify.attributeEquals('#goalsPage .goalDetail  input[name="priority"]', 'value', priority);
      }
      if (status) {
        this.verify.attributeEquals('#goalsPage .goalDetail  input[name="status"]', 'value', status);
      }
      return this;
    },
    listContainsGoal: function (index, description, priority, status){
      this
        .verify.elementPresent('#goalsTable')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(' + index + ')')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(' + index + ') .description')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(' + index + ') .priority')
        .verify.elementPresent('#goalsTable .goalRow:nth-child(' + index + ') .status')

      if (description) {
        this.verify.containsText('#goalsTable .goalRow:nth-child(' + index + ') .description', description);
      }
      if (priority) {
        this.verify.containsText('#goalsTable .goalRow:nth-child(' + index + ') .priority', priority);
      }
      if (status) {
        this.verify.containsText('#goalsTable .goalRow:nth-child(' + index + ') .status', status);
      }
      return this;
    },
    selectListTab: function(){
      return this.click('#goalsPage .goalListTab');
    },
    displayListCard: function(){
      return this.click('#goalsPage .goalListTab');
    },
    displayNewGoalCard: function(){
      return this.click('#goalsPage .newGoalTab');
    },
    displayGoalDetails: function(){
      return this.click('#goalsPage .goalDetailsTab');
    },
    selectGoal: function(index){
      return this.click('#goalsTable .goalRow:nth-child(' + index + ')');
    },
    upsertGoal: function(description, priority, status, pageElement) {
      if (description) {
        var descriptionArray = description.split('');
        for (var i = 0; i < descriptionArray.length; i++) {
          this.setValue(pageElement + ' input[name="description"]', descriptionArray[i]);
        }
      }
      if (priority) {
        var priorityArray = priority.split('');
        for (var k = 0; k < priorityArray.length; k++) {
          this.setValue(pageElement + ' input[name="priority"]', priorityArray[k]);
        }
      }
      if (status) {
        var statusArray = status.split('');
        for (var j = 0; j < statusArray.length; j++) {
          this.setValue(pageElement + ' input[name="status"]', statusArray[j]);
        }
      }

      return this;
    },
    saveGoal: function(){
      return this.verify.elementPresent('#saveGoalButton').click('#saveGoalButton');
    }
  }],
  elements: {}
};
