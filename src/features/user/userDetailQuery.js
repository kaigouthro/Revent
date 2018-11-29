export const userDetailQuery = ({ auth, userUid, match }) =>
  userUid !== null
    ? [
        {
          collection: "users",
          doc: userUid,
          storeAs: "profile"
        },
        {
          collection: "users",
          doc: userUid,
          subCollections: [{ collection: "photos" }],
          storeAs: "photos"
        },
        {
          collection: "users",
          doc: auth.uid,
          subCollections: [{ collection: "following", doc: match.params.id }],
          storeAs: "following"
        }
      ]
    : [
        {
          collection: "users",
          doc: auth.uid,
          subCollections: [{ collection: "photos" }],
          storeAs: "photos"
        }
      ]
