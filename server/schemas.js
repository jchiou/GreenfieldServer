const server = require('../server.js'); //don't need this
const Sequelize = require('sequelize');

///(why) do we need this? 
const sequelize = new Sequelize('postgres://qntzeozetttxxe:JDkRS8aTusHyPjDmp-YcWCK2qN@ec2-54-243-249-154.compute-1.amazonaws.com:5432/dfbtc6j4b2mtgi', {
	dialect: 'postgres',
	dialectOptions: {
		ssl: true
	}
});


////////////POSTGRES Tables/////////
///////////ORM: sequelize////////////


////// USER
//NOTE: w sequelize, if you don't set id, it will use primary key - id as default. 
const User = sequelize.define('user', {
		first_name: {
			type: Sequelize.STRING
		}, 
		last_name: {
			type: Sequelize.STRING
		},
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
		email: {
			type: Sequelize.STRING
		},
		fb_username: {
			type: Sequelize.STRING
		},
		fb_access: {
			type: Sequelize.STRING
		}
	}, {
		timestamps: false
	});


////// PHOTO
const Photo = sequelize.define('photo', {
		url: {
			type: Sequelize.STRING
		},
		source: {
			type: Sequelize.STRING
		}, 
		data: {
			type: Sequelize.STRING
		}
  });


////// CAPTION
const Caption = sequelize.define('caption', {
		likes: {
			type: Sequelize.INTEGER
		},
		dislikes: {
			type: Sequelize.INTEGER
		},
		caption_top: {
			type: Sequelize.STRING
		}, 
		caption_bottom: {
			type: Sequelize.STRING
		},
  	userId: {
  		type: Sequelize.STRING
  	}
  },
  	// photo_id: {
  	// 	type: Sequelize.STRING
  	// },
  	// font: {
  	// 	type: Sequelize.STRING
  	// }
  // },
  {
		timestamps: false
  });

//WE MAY NOT NEED TO DEFINE RELATIONSHIPS AS THESE ARE BEING DEFINED IN POSTICO. 
//so far as I can tell, this does not effect our error, but also causes no additional errors. 
//I propose we leave it out until we can find a need to reintroduce it :)
/*source --- target*/
// User.hasMany(Caption);
// //DEFINE CAPTION RELATIONSHIPS 
// Caption.belongsTo(User);
// // Caption.belongsTo(Photo);
// //DEFINE PHOTO RELATIONSHIPS 
// Photo.hasMany(Caption);
// Photo.hasMany(Hashtag);
/////may want Photo to belong to user as an extension !!
sequelize.sync();


module.exports = {
	User: User,
	Photo: Photo,
	Caption: Caption
	// Hashtag: Hashtag
};