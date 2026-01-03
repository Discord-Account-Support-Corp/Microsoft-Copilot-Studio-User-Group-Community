const groupURL = "https://techcommunity.microsoft.com/group/copilot-studio-community-hub";

function openGroup() {
  const newTab = window.open(groupURL, '_blank');

  if (!newTab) {
    // Pop-up blocked OR failed
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('p').textContent = 'Cannot open live group. Using fallback version:';
    document.getElementById('openCommunity').style.display = 'inline-block';

    // Optionally, point the fallback button to a cached shell or local copy
    document.getElementById('openCommunity').onclick = () => {
      window.location.href = '/fallback.html'; // a local cached page you create
    };
  } else {
    document.querySelector('.spinner').style.display = 'none';
    document.querySelector('p').textContent = 'Opening your community...';
  }
}
