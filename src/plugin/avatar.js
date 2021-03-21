import md5 from "md5";

const avatar = {
  gravatarLink(email, size) {
    return 'https://s.gravatar.com/avatar/'+md5(email)+'?d=mp&s='+size;
  }
};

export default avatar;
