var $deleteButton = $('.delete');
var $deleteForm = $('.deleteForm');
var $cancel       = $('.cancel');
$deleteButton.on('click', function () {
	$deleteForm.toggleClass('hidden');
});
$cancel.on('click', function () {
	$deleteForm.toggleClass('hidden');
});

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


// <button class="projectData">Add data point</button>
// <form id="projectDataForm" action="./?_method=PATCH" method="post">