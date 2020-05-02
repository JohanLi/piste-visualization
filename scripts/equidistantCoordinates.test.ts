import { equidistantCoordinates } from './equidistantCoordinates';

test('Able to create a series of coordinates of given distance between them', () => {
  expect(
    equidistantCoordinates(
      [
        { lat: 63.41505637188981, lng: 13.065576196801292 },
        { lat: 63.414585829580325, lng: 13.06587123979293 },
      ],
      2,
    ),
  ).toEqual([
    { lat: 63.41505637188981, lng: 13.065576196801294 },
    { lat: 63.41503905436931, lng: 13.065587055542155 },
    { lat: 63.41502173684796, lng: 13.065597914269897 },
    { lat: 63.41500441932581, lng: 13.065608772984527 },
    { lat: 63.41498710180284, lng: 13.065619631686037 },
    { lat: 63.41496978427901, lng: 13.065630490374431 },
    { lat: 63.414952466754386, lng: 13.06564134904971 },
    { lat: 63.414935149228945, lng: 13.065652207711873 },
    { lat: 63.41491783170266, lng: 13.065663066360914 },
    { lat: 63.41490051417555, lng: 13.065673924996844 },
    { lat: 63.41488319664762, lng: 13.065684783619654 },
    { lat: 63.41486587911888, lng: 13.065695642229349 },
    { lat: 63.4148485615893, lng: 13.065706500825927 },
    { lat: 63.41483124405892, lng: 13.06571735940939 },
    { lat: 63.41481392652769, lng: 13.065728217979736 },
    { lat: 63.41479660899565, lng: 13.065739076536966 },
    { lat: 63.4147792914628, lng: 13.065749935081078 },
    { lat: 63.414761973929096, lng: 13.065760793612075 },
    { lat: 63.414744656394575, lng: 13.065771652129955 },
    { lat: 63.414727338859265, lng: 13.06578251063472 },
    { lat: 63.41471002132309, lng: 13.065793369126368 },
    { lat: 63.414692703786095, lng: 13.065804227604898 },
    { lat: 63.41467538624829, lng: 13.065815086070316 },
    { lat: 63.41465806870965, lng: 13.065825944522615 },
    { lat: 63.414640751170204, lng: 13.065836802961796 },
    { lat: 63.41462343362994, lng: 13.065847661387863 },
    { lat: 63.41460611608881, lng: 13.065858519800813 },
    { lat: 63.4145887985469, lng: 13.065869378200649 },
  ]);

  expect(
    equidistantCoordinates(
      [
        { lat: 63.41505637188981, lng: 13.065576196801292 },
        { lat: 63.41266479278644, lng: 13.067838497453703 },
        { lat: 63.41062058987255, lng: 13.063160310268746 },
        { lat: 63.406784465808954, lng: 13.059080199667328 },
      ],
      100,
    ),
  ).toEqual([
    { lat: 63.41505637188981, lng: 13.065576196801294 },
    { lat: 63.4142282115243, lng: 13.066359636931153 },
    { lat: 63.41340004687174, lng: 13.067143031807364 },
    { lat: 63.412596316933275, lng: 13.067681773037245 },
    { lat: 63.411968090089395, lng: 13.06624396928666 },
    { lat: 63.4113398488051, lng: 13.064806228532163 },
    { lat: 63.41071159308148, lng: 13.063368550770715 },
    { lat: 63.409929186731375, lng: 13.062424842483084 },
    { lat: 63.409117199357084, lng: 13.061561155773955 },
    { lat: 63.40830520677179, lng: 13.060697517968629 },
    { lat: 63.40749320897602, lng: 13.05983392906292 },
  ]);
});
