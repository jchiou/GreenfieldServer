var schemas = require('./schemas.js');

module.exports = {
  addUser: function (reqBody) {
    console.log('userReq',reqBody);
    var userPost = {
      first_name: reqBody.first_name,
      last_name: reqBody.last_name,
      email: reqBody.email,
      captionId: reqBody.captionId,
      fb_username: reqBody.hashtagId,
      fb_access: reqBody.data,
      photo: reqBody.photo
    };
    var newUser = schemas.User.build(userPost);
    newUser.save()
    .then(function(newUser){
      console.log('userPostsucceeded!!');
      return newUser;
    })
    .catch(function(err) {
      console.log(err);
    });
  },
  updateUserInfo: function (reqBody) {
    var newUserInfo = {
      first_name: reqBody.first_name
    }
  },
  getUserInfo: function (queryBody) {
    schemas.User.findOne({ where: {captionId: queryBody.captionId} })
      .then(function(User) {
        return User;
      })
      .catch(function(err) {
        console.error(err);
      })
  },
  getAllPhotos: function  () {
    schemas.Photo.findAll({})
      .then(function (results) {
        return results;
      })
      .catch(function (err) {
        console.log('Sweetie, youll get there, keep trying, k?', err);
      });
  },
  getDailyPhoto: function (cb) {
    //currently: placeholder photo!! 
    schemas.Photo.findOne({ where: { source: "imgur" }})
    .then(function(photo) {
       cb(photo.dataValues);
    }).catch( function(err) {
      console.log('Error retrieving daily photo: ', err);
      cb(err);
    });
  },
  getDailyPhotoId: function (photoDataVals) {
      return photoDataVals.id;
  },
  postPhoto: function (reqBody) {
    var photoPost = {
      user_id: reqBody.user_id,
      url: reqBody.url,
      source: reqBody.source,
      hashtagId: reqBody.hashtagId,
      data: reqBody.data
    };

    //check if photo is duplicate
    schemas.Photo.findOne({ where: {url: reqBody.url} }).then(function(photo) {
      if (!photo) {
        var newPhoto = schemas.Photo.build(photoPost);
        newPhoto.save()
          .then(function(newPhoto){
            return newPhoto;
          })
          .catch(function(err){
            console.log('Error posting photo: ', err);
          });  
      } else {
        console.log('photo exists already')
        return 'Photo already in database.';
      }
    })
  },
  getPhotoCaptions: function  (photoId, cb) {
    /*do this with pure sql: 
SELECT id, likes, dislikes, caption_top, caption_bottom, user_id, photo_id 
FROM captions AS caption WHERE caption.photo_id = 1;
    */
    schemas.Caption.findAll({ where: {photoId: photoId}})
      .then(function (captions) {
        cb(captions);
      })
      .catch(function(err){
        console.log('Error retrieving daily captions: ', err);
        cb(err);
      });
  },
  postCaption: function (reqBody) {
    var captionPost = {
      userId: reqBody.userId,
      photoId: reqBody.photoId,
      caption_top: reqBody.caption_top,
      caption_bottom: reqBody.caption_bottom,
      likes: reqBody.likes,
      dislikes: reqBody.dislikes,
      font: reqBody.font
    };
    var newCaption = schemas.Caption.build(captionPost);
    newCaption.save()
      .then(function(newCaption){
        console.log('yusssss successs!');
        return newCaption;
      })
      .catch(function(err){
        console.log('Error in caption post: ', err);
      });
  },
  upVoteCaption: function (captionId) {
    schemas.Caption.findOne({ where: {id: captionId} })
      .then(function (caption) {
        var oldVal = caption.likes;
        caption.update({
          likes: oldVal + 1
        });
        console.log('successfully upvoted!')
        return oldVal + 1;
      })
      .catch(function(err){
        console.log('Error upvoting caption: ', err);
      });
  }, 
  downVoteCaption: function (captionId) {
    schemas.Caption.findOne({ where: {id: captionId} })
      .then(function (caption) {
        var oldVal = caption.dislikes;
        caption.update({
          dislikes: oldVal + 1
        });
        console.log('successfully downvoted!')
        return oldVal + 1;
      })
      .catch(function(err){
        console.log('Error upvoting caption: ', err);
      });
  },
  // returns the likes, dislikes, and total votes of a caption
  displayCaptionVotes: function (captionId, callback) {
    //find likes
    schemas.Caption.findOne({ where: { id: captionId } })
      .then(function (caption) {
        const captionVotes = {
          likes: caption.likes,
          dislikes: caption.dislikes,
          total: caption.likes + caption.dislikes
         }
         console.log(captionVotes);
        callback(captionVotes);
      })
      .catch(function(err) {
        console.log('Error getting caption votes: ', err);
      })
  },
  getAllCaptions: function(cb) {
    schemas.Caption.findAll({})
      .then(function(results) {
        console.log('WE DID IT!!!!' + results)
        cb(results)
      })
      .catch(function(err) {
        cb(err)
      })
  }
};