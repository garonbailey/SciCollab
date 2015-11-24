var sessionDiv = $('.user-action');
var sameDiv = $('div');
var diffDiv = $('div');

sameDiv.html('<h4><a href="/users/<%= singleUser._id %>/edit">Edit Profile</a></h4>');

diffDiv.html('<form method="PATCH" action="/users/<%= presentUser %>">
		<input type="hidden" name="presentUser[colleagues]" value="<%= singleUser.firstname %> <%= singleUser.lastname %>">
		<input type="hidden" name="presentUser[colleagues]" value="<%= singleUser._id %>">
		<input type="submit" value="Add Colleague to Collaborate">
	</form>');
var checkUser = function () {
	if (presentUser.id === singleUser._id) {
		sessionDiv.append(sameDiv);
	} else {
		sessionDiv.append(diffDiv);
	}
};