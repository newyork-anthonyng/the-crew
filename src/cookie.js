function setup() {
  const cookie = document.cookie.split(";");
  let name = undefined;
  for (let i = 0; i < cookie.length; i++) {
    if (cookie[i].startsWith("name")) {
      name = cookie[i].split("=")[1];
      break;
    }
  }
  if (!name) {
    name = prompt("Name");
    document.cookie = `name=${name}`;
  }
}

export default setup;
