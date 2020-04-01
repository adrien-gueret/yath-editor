export default {
  uploadFile(file, cloudName, presetName, onProgress = () => {}) {
    return new Promise((resolve, reject) => {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
      xhr.upload.addEventListener('progress', function(e) {
        const progress = Math.round((e.loaded * 100.0) / e.total);
        onProgress(progress);
      });
  
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          reject();
          return;
        }

        const response = JSON.parse(xhr.responseText);    
        resolve(response.secure_url);
      };
      xhr.onerror = reject;
      xhr.ontimeout = reject;
  
      formData.append('upload_preset', presetName);
      formData.append('tags', 'from_yath_editor');
      formData.append('file', file);
      xhr.send(formData);
    });
  },
}