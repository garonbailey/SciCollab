//Confirm Delete Profile
var $deleteButton = $('.delete');
var $deleteForm = $('.deleteForm');
var $cancel       = $('.cancel');
$deleteButton.on('click', function () {
	$deleteForm.toggleClass('hidden');
});
$cancel.on('click', function () {
	$deleteForm.toggleClass('hidden');
});

//Add extra data inputs; not properly functioning
var $addData = $('.projectData');
var $dataInput = $('<input type="text" name="project[data.data][]" placeholder="data">');
var $dataForm = $('#projectDataForm');

$addData.on('click', function () {
	$dataForm.prepend($dataInput);
});

var inputs = 0;

$('.addSomeData').on('click', function () {
	inputs = prompt("How many data points do you have today?");
});