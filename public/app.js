var $deleteButton = $('.delete');
var $deleteForm = $('.deleteForm');
var $cancel       = $('.cancel');
$deleteButton.on('click', function () {
	$deleteForm.toggleClass('hidden');
});
$cancel.on('click', function () {
	$deleteForm.toggleClass('hidden');
});