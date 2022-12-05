

export const getFileType = (fileExtension) => {
    var fileType = "";
    switch (fileExtension.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'jfif':
        case 'gif':
        case 'svg':
        case 'webp':
            fileType = "image";
            break;
        case 'mp4':
        case 'mov':
        case 'webm':
            fileType = "video";
            break;
        case 'mp3':
        case 'wav':
        case 'flac':
            fileType = "audio";
            break;
        case 'pdf':
            fileType = "pdf";
            break;
    }
    return fileType;
}