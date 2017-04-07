import {Injectable} from '@angular/core';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {AuthService} from './auth.service';

@Injectable()
export class UserService {

  userdataStream: FirebaseObjectObservable<any[]>;


  constructor(public af: AngularFire, private authService: AuthService) {
  }

  login(provider: string) {
    this.authService.login(provider);
  }

  logout() {
    this.authService.logout();
  }

  getUserdata(uid): FirebaseObjectObservable<any[]> {
    if (uid !== '') {
      try {
        // console.log(uid);
        const userStream = this.af.database.object('/users/' + uid);

        userStream.take(1).subscribe(snapshot => {
          //  console.log(snapshot);

          if (!snapshot.hasOwnProperty('private')) {
            const privateData = {
              address: {
                street: '',
                number: '',
                zip: '',
                city: '',
                country: ''
              },
              job: {
                frontend: false,
                backend: false,
                webdesigner: false,
                devop: false,
                architect: false,
                pm: false,
                hr: false,
                commercial: false,
                amateur: false,
                other: '',
                technologies: ''
              },
              email: '',
              company: {
                name: '',
                id: ''
              }
            };
            userStream.update({private: privateData});
          }
          if (!snapshot.hasOwnProperty('avatar')) {
            userStream.update({avatar: ''});
          }
          if (!snapshot.hasOwnProperty('voornaam')) {
            userStream.update({voornaam: ''});
          }
          if (!snapshot.hasOwnProperty('familienaam')) {
            userStream.update({familienaam: ''});
          }
          if (!snapshot.hasOwnProperty('email')) {
            userStream.update({email: ''});
          }
          if (!snapshot.hasOwnProperty('twitter')) {
            userStream.update({twitter: ''});
          }
        });

        return userStream;
      } catch (err) {
        return new FirebaseObjectObservable;
      }
    }
  }

  getFirstname(uid) {
    let firstname = '';
    this.af.database.object('/users/' + uid).take(1).subscribe(snapshot => {
      firstname = snapshot.voornaam;
    });
    return firstname;
  }

  getPrivateData(uid) {
    let privateData = {};
    this.af.database.object('/users/' + uid).take(1).subscribe(snapshot => {
      privateData = snapshot.private;
    });
    return privateData;
  }

  getLastname(uid) {
    let lastname = '';
    this.af.database.object('/users/' + uid).take(1).subscribe(snapshot => {
      lastname = snapshot.familienaam;
    });
    return lastname;
  }


  updatePublicUserdata(userdataStream, key, value) {
    switch (key) {
      case 'twitter':
        userdataStream.update({twitter: value});
        break;
      case 'voornaam':
        userdataStream.update({voornaam: value});
        break;
      case 'familienaam':
        userdataStream.update({familienaam: value});
        break;
    }
  }

  updatePrivateUserdata(userdataStream, key, value) {
    const privateData = this.getPrivateDataAsObject(userdataStream);
    privateData[key] = value;
    userdataStream.update({'private': privateData});
  }

  updateJob(userdataStream, key, value) {
    const privateData = this.getPrivateDataAsObject(userdataStream);
    privateData['job'][key] = value;
    userdataStream.update({'private': privateData});
  }

  updateCompany(userdataStream, key, value) {
    const privateData = this.getPrivateDataAsObject(userdataStream);
    privateData['company'][key] = value;
    userdataStream.update({'private': privateData});
  }

  getPrivateDataAsObject(userdataStream) {
    let privateData;
    userdataStream.take(1).subscribe(snapshot => {
      privateData = snapshot['private'];
    });
    return privateData;
  }

}
