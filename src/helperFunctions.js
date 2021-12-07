export const hidePanels = () => {
  document.getElementById('mygame').style.display = 'none';
  document.querySelector('.webcam-panel').style.display = 'none';
};

export const showPanels = () => {
  document.getElementById('mygame').style.display = 'block';
  document.querySelector('.webcam-panel').style.display = 'flex';
};
