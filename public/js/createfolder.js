// $('#form').on('submit', handleFormSubmit);
// function handleFormSubmit(e) {
// 	e.preventDefault();
// 	const form = $(this);
// 	const formData = new FormData(form[0]);
// 	for (const p of formData) {
// 		if (p[1].size <= 0) {
// 			return;
// 		}
// 	}
// 	$.ajax({
// 		method: 'POST',
// 		data: formData,
// 		cache: false,
// 		contentType: false,
// 		processData: false,
// 		url: '/createfolder',
// 		success: handlecreateSuccess,
// 	});
// }