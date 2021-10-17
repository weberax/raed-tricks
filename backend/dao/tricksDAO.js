import { ObjectId } from "mongodb"

let tricks

export default class TricksDAO {
  static async injectDB(conn) {
    if (tricks) {
      return
    }
    try {
      tricks = await conn.db(process.env.HIGHLINEFREESTYLE_NS).collection("tricks")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in tricksDAO: ${e}`
      )
    }
  }

  static async getTricks() {

    const pipeline = [
      {
        '$project': {
          'name': {
            '$cond': [
              {
                '$eq': [
                  '$alias', ''
                ]
              }, '$technicalName', '$alias'
            ]
          }, 
          'difficultyLevel': 1, 
          'stickFrequency': 1,
          'startPos': 1,
          'endPos': 1
        }
      }, {
        '$sort': {
          'difficultyLevel': 1, 
          'name': 1
        }
      }
    ]

    let cursor
    try {
      cursor = await tricks.aggregate(pipeline)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { trickList: [], totalNumTricks: totalNumTricks }
    }

    try {
      const trickList = await cursor.toArray()
      const totalNumTricks = trickList.length
    
      return { trickList, totalNumTricks }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents`
      )
      return { trickList: [], totalNumTricks: 0 }
    }
  }

  static async getTrickById(id) {
    
    const query = { _id: ObjectId(id) }
    const project = {}
    const sort = {}

    let trick
    try {
      trick = await tricks
        .findOne(query, project)
    } catch(e) {
      console.error(`Unable to issue findOne command, ${e}`)
      return { trick: null }
    }

    return trick
  }

  static async addTrick(trick) {
    try {
      const trickDoc = {
        alias: trick.alias,
        technicalName: trick.technicalName,
        establishedBy: trick.establishedBy,
        yearEstablished: trick.yearEstablished,
        linkToVideo: trick.linkToVideo,
        startPos: trick.startPos,
        endPos: trick.endPos,
        difficultyLevel: trick.difficultyLevel,
        description: trick.description,
        tips: trick.tips,
        stickFrequency: trick.stickFrequency
      }
      return await tricks.insertOne(trickDoc)
    } catch(e) {
      console.error(`Unable to create trick, ${e}`)
      return { error: e }
    }
  }

  static async updateTrick( trickId, trickUpdate) {
    try {
      const updateResponse = await tricks.updateOne(
        { _id: ObjectId(trickId) },
        { $set: trickUpdate}
      )

      return updateResponse
    } catch(e) {
      console.error(`Unable to update trick, ${e}`)
      return { error: e }
    }
  }

  static async deleteTrick( trickId ) {
    try {
      const deleteResponse = await tricks.deleteOne(
        { _id: ObjectId(trickId) }
      )

      return deleteResponse
    } catch(e) {
      console.error(`Unable to delete trick, ${e}`)
      return { error: e }
    }
  }
}