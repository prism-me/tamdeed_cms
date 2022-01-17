export const ckEditorConfig = {
    toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
        { name: 'insert', items: ['Link', 'EasyImageUpload', 'Table'] },
        { name: 'styles', items: ['Styles', 'FontSize', 'Font', 'Format', 'TextColor', 'BGColor'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'source', items: ['Source'] }
    ],
    extraPlugins: 'easyimage',
    format_tags: 'p;h1;h2;h3;h4;h5;h6',
    // removePlugins: 'image',
    //cloudServices_uploadUrl: 'https://33333.cke-cs.com/easyimage/upload/', //this is a demo ckeditor cloud service URL
    cloudServices_uploadUrl: '/app/Data' //this is folder hosted on our server which is accessible as localhost/app/data
}