/*    PLAYER SHOOTING AREA
    contains all functional components of the shooting area, including firing sounds,
    interface for placement calls, and actual firing mechanics. the firing area allows
    players to shoot weapons when within the area's trigger bounds
*/

import * as utils from '@dcl-sdk/utils'
import {
  Animator,
  AudioSource,
  AvatarAnchorPointType,
  AvatarAttach,
  ColliderLayer,
  Entity,
  GltfContainer,
  InputAction,
  Material,
  MeshCollider,
  MeshRenderer,
  PointerEventType,
  RaycastQueryType,
  RaycastResult,
  Schemas,
  Transform,
  engine,
  inputSystem,
  pointerEventsSystem,
  raycastSystem,

} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { ShotDecalObject } from './shot-decal-object'
import { ScoreObject } from './score-object'
import { triggerEmote, triggerSceneEmote } from '~system/RestrictedActions'
import { logTestResult } from '~system/Testing'


/** manages the state of the shooting area, acting as the functional linkage between a target
 *  being shot, playing sounds, and bulletmark placement. the area is composed of 2 objects:
 *      1 - trigger box area that de/actives shooting when the player leaves/enter the area
 *      2 - floor object that displays shooting area's location
 */




  var variavelState: boolean = true
  export {variavelState}
 
  
  let gameStarted: boolean = false

export module PlayerShootingArea {
  /** when true debug logs are generated (toggle off when you deploy) */
  const isDebugging: boolean = true

  //audio paths
  const AUDIO_SHOT_SFX: string[] = ['audio/shooting-range/laser-gun.mp3', 'audio/shooting-range/shot-missed.mp3']
  

  //audio paths
  const AUDIO_WIN: string[] = ['audio/shooting-range/victorysound.mp3','audio/shooting-range/mixkit-losing-bleeps-2026.mp3']
  

  //shooting area size
  const SHOOTING_AREA_SCALE = { x: 32, y: 1, z: 32 }

  /** when true the player can fire at targets */
  var inShootingArea: boolean = false

  /** trigger area, allows players to shoot when inside */
  var shootingAreaEntity: undefined | Entity = undefined
  /** floor, displays shooting area location */
  var shootingFloorEntity: Entity








// // LIBERA TRIGGER 
//   const startButton = engine.addEntity()
//   Transform.create(startButton, {position: Vector3.create(17, 1, 17) })
//   MeshRenderer.setBox(startButton)
//   MeshCollider.setBox(startButton)
//   pointerEventsSystem.onPointerDown(
//     {
//       entity: startButton,
//       opts: { button: InputAction.IA_POINTER,
//       hoverText: 'Click'
//     }},
//     () => {
//     function startGame() {
//         console.log("GAME START")
//        gameStarted = true
      
//     }
//     startGame()  
//   }
  
//   )







  /** object interface used to define all data required to manipulate the transform of the shooting area */
  export interface ShootingAreaTransformData {
    x: number
    y: number
    z: number
  }

  //audio objects setup (single object for all sounds anchored to the player)
  //  NOTE: currently the 'play from start' functionality is scuffed in SDK7, so we need an array roll of sounds
  //  create gun shot audio SFX objects
  const entityAudioShotHit: Entity[][] = [[], []]
  //process each type of audio SFX
  for (let i: number = 0; i < AUDIO_SHOT_SFX.length; i++) {
    //create a few of each type (allows over-play)
    for (let j: number = 0; j < 5; j++) {
      const entity = engine.addEntity()
      Transform.create(entity)
      AudioSource.create(entity, { audioClipUrl: AUDIO_SHOT_SFX[i], loop: false, playing: false })
      AvatarAttach.create(entity, { anchorPointId: AvatarAnchorPointType.AAPT_NAME_TAG })
      entityAudioShotHit[i].push(entity)
    }
  }
   
  
  
  let fullscoreantonio: number = 0

  let losescoreantonio: number = 0

                
  const MVICTORYANIMATION = 'models/shooting-range/dancingcube.glb'

          

// let fase1 = engine.addEntity()


// GltfContainer.create(fase1, {
//   src: 'models/shooting-range/fruitzapper1.glb',
// })

// Transform.create(fase1, {
//   position: Vector3.create(64, 0, 0),

  
// })


// Animator.create(fase1, {
//   states: [
//     {
//       clip: '1',
//       playing: false, 
//       shouldReset: false,
//       loop: false,
     
//     }

//   ]
// })

// let fase2 = engine.addEntity()


// GltfContainer.create(fase2, {
//   src: 'models/shooting-range/fruitzapper2.glb'
// })

// Transform.create(fase2, {
//   position: Vector3.create(64, 0, 0),
  
// })


// Animator.create(fase2, {
//   states: [
//     {
//       clip: '1',
//       playing: false, 
//       shouldReset: false,
//       loop: false,
     
//     }

//   ]
// })

// let fase3 = engine.addEntity()


// GltfContainer.create(fase3, {
//   src: 'models/shooting-range/fruitzapper3.glb'
// })

// Transform.create(fase3, {
//   position: Vector3.create(64, 0, 0),
  
// })


// Animator.create(fase3, {
//   states: [
//     {
//       clip: '1',
//       playing: false, 
//       shouldReset: false,
//       loop: false,
     
//     }

//   ]
// })

// let fase4 = engine.addEntity()


// GltfContainer.create(fase4, {
//   src: 'models/shooting-range/fruitzapper4.glb'
// })

// Transform.create(fase4, {
//   position: Vector3.create(64, 0, 0),
  
// })


// Animator.create(fase4, {
//   states: [
//     {
//       clip: '1',
//       playing: false, 
//       shouldReset: true,
//       loop: false,
     
//     }

//   ]
// })







let newshoting = engine.addEntity()


GltfContainer.create(newshoting, {
  src: 'models/shooting-range/alvosverdes.glb'
})

Transform.create(newshoting, {
  position: Vector3.create(64, 0, 0),
  
})


Animator.create(newshoting, {
  states: [
    {
      clip: '1',
      playing: false, 
      shouldReset: true,
      loop: false,
     
    }, 
    {
      clip: '2',
      playing: false, 
      shouldReset: true,
      loop: false,
      
    },
    {
      clip: '3',
      playing: false, 
      shouldReset: true,
      loop: false,
     
    },  {
      clip: '4',
      playing: false, 
      shouldReset: true,
      loop: false,
     
    },
    {
      clip: '5',
      playing: false, 
      shouldReset: true,
      loop: false,
     
    }, 


  ]
})



let scoreBar = engine.addEntity()

GltfContainer.create(scoreBar, {
  src: 'models/shooting-range/scoreBar.glb'
})

Transform.create(scoreBar, {
  position: Vector3.create(16, 1, 16),
})





let shootEffect = engine.addEntity()




GltfContainer.create(shootEffect, {
  src: 'models/shooting-range/shooteffect.glb'
})

Transform.create(shootEffect, {
  position: Vector3.create(64, 0, 0),
})


Animator.create(shootEffect, {
  states: [
    {
      clip: '1',
      playing: false, 
      shouldReset: true,
      loop: false,
     
    }, 
   

  ]
    
})





//   //cubo de animacaO TARGET 
//   const fases = engine.addEntity()
// Transform.create(fases, { position: Vector3.create(30, 0, 30) })
// MeshRenderer.setBox(fases)
// MeshCollider.setBox(fases)
// pointerEventsSystem.onPointerDown(
//   {
//     entity: fases,
//     opts: { button: InputAction.IA_POINTER, hoverText: 'Dance' },
//   },
//   () => {
//     if (fullscoreantonio < 80)  {
//       (fullscoreantonio = 0)
//       Animator.playSingleAnimation(newshoting2, '1') 
//     }
//   if (fullscoreantonio >= 80 && fullscoreantonio <150) {
//     (fullscoreantonio = 80)
//     Animator.playSingleAnimation(newshoting2, '2') 
//   }
//  if (fullscoreantonio >= 150 && fullscoreantonio <200) {
//   (fullscoreantonio = 150)
//   Animator.playSingleAnimation(newshoting2, '3') 
//  }
//  if (fullscoreantonio >=200 ) {
//   (fullscoreantonio = 200)
//   Animator.playSingleAnimation(newshoting2, '4') 
// }
//   }
  
// )


// Create entity
const sourceEntity = engine.addEntity()

// Create AudioSource component
AudioSource.create(sourceEntity, {
	audioClipUrl: 'audio/shooting-range/FRUIT-ZAPPER.mp3',
	loop: true,
	playing: true,
})

Transform.create(sourceEntity, {
  position: Vector3.create(9, 1, 9),
})

let tampinha : number = 10
let button = engine.addEntity()

GltfContainer.create(button, {
  src: 'models/shooting-range/holobuton.glb',
  visibleMeshesCollisionMask: ColliderLayer.CL_POINTER
})

Transform.create(button, {
  position: Vector3.create(64, 0, 0),

})
Animator.create(button, {
  states: [
    {
      clip: '1',
      playing: false, 
      shouldReset: true,
      loop: false,
     
    }

  ]
})









// if (raycastResult.hits[0].meshName != 'button') {
//   console.log("button"),
//   (fullscoreantonio += 0),
//   (losescoreantonio += 0)
// }


pointerEventsSystem.onPointerDown(
	{
		entity: button,
		opts: { button: InputAction.IA_POINTER, hoverText: 'Game Start' },
	},
	function () {
		console.log('CLICKED AVOCADO') 

    Animator.playSingleAnimation(button,'1', false)

    console.log("GAME START")
    gameStarted = true
   

    tampinha += 10



    if (tampinha == 20 )  {
      
      
      if (fullscoreantonio < 150)  {
      (fullscoreantonio == 0)

      


      



    


      let Fase1 = engine.addEntity()


GltfContainer.create(Fase1, {
  src: 'models/shooting-range/fruitzapper1.glb',
})

Transform.create(Fase1, {
  position: Vector3.create(64, 0, 0),

  
})


Animator.create(Fase1, {
  states: [
    {
      clip: '1',
      playing: true, 
      shouldReset: true,
      loop: false,
     
    }

  ]
})
}


    


     
    }




    if (tampinha == 47 )  {
     

       

      if (fullscoreantonio >= 150 && fullscoreantonio <250) {
        (fullscoreantonio = 180)




    //     let level2 = 
    //     engine.addEntity()
     
    
    // GltfContainer.create(level2, {
    //   src: 'models/shooting-range/level3.glb',
    // })
    
    // Transform.create(level2, {
    //   position: Vector3.create(64, 0, 0),
    
      
    // })
    








    
    
        let fase2 = 
        engine.addEntity()
     
    
    GltfContainer.create(fase2, {
      src: 'models/shooting-range/fruitzapper2.glb',
    })
    
    Transform.create(fase2, {
      position: Vector3.create(64, 0, 0),
    
      
    })
    
    
    
    Animator.create(fase2, {
      states: [
        {
          clip: '1',
          playing: false, 
          shouldReset: false,
          loop: false,
         
        }
    
      ]
    })








     }



      




  





  





    // Animator.playSingleAnimation(fase2, '1', false) 

  }



  if (tampinha == 87 )  {



     
 if (fullscoreantonio >= 250 && fullscoreantonio <350) {
  (fullscoreantonio = 280)
  let fase3 = engine.addEntity()


  GltfContainer.create(fase3, {
    src: 'models/shooting-range/fruitzapper3.glb'
  })
  
  Transform.create(fase3, {
    position: Vector3.create(64, 0, 0),
    
  })
  
  
  Animator.create(fase3, {
    states: [
      {
        clip: '1',
        playing: false, 
        shouldReset: false,
        loop: false,
       
      }
  
    ]
  })

  // Animator.stopAllAnimations(fase2)
  // Animator.playSingleAnimation(fase3, '1', false) 
 
 }







  }




  if (tampinha == 97 )  {if (fullscoreantonio >=350 ) {
    (fullscoreantonio = 380)
  
  
  
    let fase4 = engine.addEntity()
  
  
  GltfContainer.create(fase4, {
    src: 'models/shooting-range/fruitzapper4.glb'
  })
  
  Transform.create(fase4, {
    position: Vector3.create(64, 0, 0),
    
  })
  
  
  Animator.create(fase4, {
    states: [
      {
        clip: '1',
        playing: false, 
        shouldReset: false,
        loop: false,
       
      }
  
  
    ]
  
    
  })
  
  }}




 
 
 

	}
)



 // const clipAnim = Animator.getClip(newshoting, 'Animation')

  //clipAnim.loop = false
  


  /** next audio object that should be played */
  var audioIndex: number[] = [0, 0,]
  /** plays an audio sound of the given type */
  function PlayShotSound(type: number) {
    //grab next index, check for roll-over
    audioIndex[type]++
    if (audioIndex[type] >= entityAudioShotHit[type].length) audioIndex[type] = 0
    //play next sound
    AudioSource.playSound(entityAudioShotHit[type][audioIndex[type]], AUDIO_SHOT_SFX[type])
  };




  


  /** next audio object that should be played */
  var audioWin: number[] = [0,0]
  /** plays an audio sound of the given type */
  function PlayWinSound(type: number) {
    //grab next index, check for roll-over
    audioWin[type]++
    if (audioWin[type] >= entityAudioShotHit[type].length) audioWin[type] = 0
    //play next sound
    AudioSource.playSound(entityAudioShotHit[type][audioWin[type]], AUDIO_WIN[type])
  };





  /** left click input -> fire a ray */
  engine.addSystem(() => {
    //pull in feedback from input system
    const cmd = inputSystem.getInputCommand(InputAction.IA_POINTER, PointerEventType.PET_DOWN)
    //if input was triggered, attmept to fire a shot
    if (cmd) {
      if (isDebugging) console.log('Shooting Area: left click => attmepting to fire shot')
      FireShot()
    }
  })


  /** fires a ray from the player's camera, checking for a target hit */
  export function FireShot() {
    //ensure player is within firing zone
    if (!gameStarted) return

    //draw a new raycast from the camera's position
    raycastSystem.registerLocalDirectionRaycast(
      {
        entity: engine.CameraEntity,
        opts: {
          queryType: RaycastQueryType.RQT_HIT_FIRST,
          direction: Vector3.Forward(), //Transform.get(engine.CameraEntity).rotation
          maxDistance: 64
        }
      }
      ,
      
      function (raycastResult) {
        //entity was hit
        if (raycastResult.hits.length > 0) {
          if (raycastResult.hits[0].entityId) {
            if (isDebugging) console.log('Shooting Area: valid hit found, attempting to find entity...')
            //attempt to get hit position and hit entity
            const hitPos = raycastResult.hits[0].position
            if (!hitPos) return
            const hitID = raycastResult.hits[0].entityId
            if (!hitID) return
            const entity = hitID as Entity
            const transform = Transform.get(entity)
            const relPos = {
              x: hitPos.x - transform.position.x,
              y: hitPos.y - transform.position.y,
              z: hitPos.z - transform.position.z - 0.05

              
              
            }
            console.log(raycastResult.hits[0].meshName)



            if (isDebugging)
              console.log(
                'Shooting Area: hit validated entityID=' +
                  hitID +
                  ', mesh=' +
                  raycastResult.hits[0].meshName +
                  '\t\nposition{ x=' +
                  relPos.x +
                  ', y=' +
                  relPos.y +
                  ', z=' +
                  relPos.z +
                  ' }'
              )
            



              if (raycastResult.hits[0].meshName != 'target74_collider') {
    
          
          
                   //render new shot decal
                   Animator.playSingleAnimation(shootEffect, '1')
            // ShotDecalObject.Create({ parent: entity, pos: relPos })
            //render new score display
            switch (raycastResult.hits[0].meshName) {
              case 'button':
      fullscoreantonio += 0
      console.log("botao")
      console.log(fullscoreantonio)
          break

              case '1_collider':
               //play audio - hit
            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)
                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })
                break



                case '2_collider':
                   //play audio - hit
           
            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)



                // ScoreObject.Create({
                //   type: ScoreObject.SCORE_TYPE.TEN,
                //   pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z }
                // })
                break

                case '3_collider':  
                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)





             ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z }
                })
                break

                case '4_collider':
                      //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)
  

                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z }
                })
                break

                case '5_collider':
                     //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)

                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })

                break


                case '6_collider':
                      //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)

                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })
                break




                case '7_collider':

                   //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)





                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })
                break

                case '8_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break   


                case '9_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break   




                case '10_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break   



                case '11_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break 
                
                
                case '12_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break   



                case '13_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break   
                case '14_collider':


                //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TEN,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z  }
                })






                break   


















                
                

              case '1_collider':    
                    //play audio - hit
            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)







                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.TWENTYFIVE,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z }
                })
                break





              case '1_collider':



              //play audio - hit

            PlayShotSound(0)
            fullscoreantonio += 10
            console.log("++++")
            console.log(fullscoreantonio)



                ScoreObject.Create({
                  type: ScoreObject.SCORE_TYPE.FIFTY,
                  pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z }
                })
                break




                case 'button_collider':

            console.log("cubo sem pontos")



                // // ScoreObject.Create({
                // //   type: ScoreObject.SCORE_TYPE.FIFTY,
                // //   pos: { x: hitPos.x, y: hitPos.y, z: hitPos.z }
                // })
                break




























            }



            // //play audio - hit
            // PlayShotSound(0)
            //  fullscoreantonio += 10
            //  console.log("++++")
            //  console.log(fullscoreantonio)




              }

              else {
                PlayShotSound(1)
                losescoreantonio += 10
                console.log(losescoreantonio)

           



                
              }



             function DanceVictory() {
      
              if ( fullscoreantonio >= 160 && fullscoreantonio <= 170 ) {         

               (fullscoreantonio = 180) 
                // const clipAnim = Animator.getClip(newshoting, 'Animation')

                // clipAnim.shouldReset = true

               // Animator.stopAllAnimations(newshoting, true)
              


              // Animator.playSingleAnimation(fase1, '1')

              


                console.log('vc venceu a primeira fase')



                let nivel2 = engine.addEntity()



GltfContainer.create(nivel2, {
  src: 'models/shooting-range/level1.glb'
})

Transform.create(nivel2, {
  position: Vector3.create(64, 0, 0),
  
})


Animator.create(nivel2, {
  states: [
    {
      clip: '1',
      playing: true, 
      shouldReset: false,
      loop: false,
     
    }

  ]
})
Animator.playSingleAnimation(nivel2, '1', true )


                inShootingArea = false

                tampinha = 47


                PlayWinSound(0)
                
                
                gameStarted=false 
                
                const entity = engine.addEntity()
                Transform.create(entity, {
                 
                  position: { x: 16, y: 1, z: 16 }
                })
          
                //  add custom model
                // GltfContainer.create(entity, {
                //   src: nivel2,
                //   visibleMeshesCollisionMask: undefined,
                //   invisibleMeshesCollisionMask: undefined
                // })

              }

            }
              DanceVictory() 
              



        function DanceVictory2() {
      
          if ( fullscoreantonio >= 249 && fullscoreantonio <= 250 ) {                               

            console.log('vc venceu a segunda fase')


            let nivel3 = engine.addEntity()



            GltfContainer.create(nivel3, {
              src: 'models/shooting-range/level3.glb'
            })
            
            Transform.create(nivel3, {
              position: Vector3.create(64, 0, 0),
              
            })
            
            
            Animator.create(nivel3, {
              states: [
                {
                  clip: '1',
                  playing: true, 
                  shouldReset: false,
                  loop: false,
                 
                }
            
              ]
            })
            Animator.playSingleAnimation(nivel3, '1', true )
            

            tampinha = 74

            inShootingArea = false





            PlayWinSound(0)
            
            
            gameStarted=false 
            
            const entity = engine.addEntity()
            Transform.create(entity, {
             
              position: { x: 16, y: 1, z: 16 }
            })
      
            //  add custom model
            GltfContainer.create(entity, {
              src: MVICTORYANIMATION,
              visibleMeshesCollisionMask: undefined,
              invisibleMeshesCollisionMask: undefined
            })

          }

        }
          DanceVictory2() 
      

            function DanceVictory3() {
      
            if ( fullscoreantonio >= 449 && fullscoreantonio <= 950 ) {                               
              // (fullscoreantonio = 0) 
              // const clipAnim = Animator.getClip(newshoting, 'Animation')
  
              // clipAnim.shouldReset = true
  
             // Animator.stopAllAnimations(newshoting, true)
            
  
  
            // Animator.playSingleAnimation(newshoting, '5')
  
            
            let nivel4 = engine.addEntity()



            GltfContainer.create(nivel4, {
              src: 'models/shooting-range/win.glb'
            })
            
            Transform.create(nivel4, {
              position: Vector3.create(64, 0, 0),
              
            })
            
            
            Animator.create(nivel4, {
              states: [
                {
                  clip: '1',
                  playing: true, 
                  shouldReset: false,
                  loop: false,
                 
                }
            
              ]
            })
            Animator.playSingleAnimation(nivel4, '1', true )
            
  
  
  
              PlayWinSound(0)
              
              
              gameStarted=false 
              
              // const entity = engine.addEntity()
              // Transform.create(entity, {
               
              //   position: { x: 16, y: 1, z: 16 }
              // })
        
              // //  add custom model
              // GltfContainer.create(entity, {
              //   src: MVICTORYANIMATION,
              //   visibleMeshesCollisionMask: undefined,
              //   invisibleMeshesCollisionMask: undefined
              // })
  
            }
  
          }
            DanceVictory3() 


            // function DanceVictory4() {
      
            //   if ( fullscoreantonio >= 400 && fullscoreantonio <= 410 ) {    

            //    // TO RESET
            //     // (fullscoreantonio = 0)                            

    
    
            //   // Animator.playSingleAnimation(newshoting, '5')
                
            // let win = engine.addEntity()



            // GltfContainer.create(win, {
            //   src: 'models/shooting-range/win.glb'
            // })
            
            // Transform.create(win, {
            //   position: Vector3.create(64, 0, 0),
              
            // })
            
            
            // Animator.create(win, {
            //   states: [
            //     {
            //       clip: '1',
            //       playing: true, 
            //       shouldReset: false,
            //       loop: false,
                 
            //     }
            
            //   ]
            // })
              
    
// Animator.playSingleAnimation(win, '1')
    
//                 console.log('vc ganhou o jogo')


//                 tampinha = 10
    
//                 inShootingArea = false
    
    
    
    
//                 PlayWinSound(0)
                
                
//                 gameStarted=false 
                
//                 const entity = engine.addEntity()
//                 Transform.create(entity, {
                 
//                   position: { x: 16, y: 1, z: 16 }
//                 })
          
                //  add custom model
        //         GltfContainer.create(entity, {
        //           src: MVICTORYANIMATION,
        //           visibleMeshesCollisionMask: undefined,
        //           invisibleMeshesCollisionMask: undefined
        //         })
    
        //       }
    
        //     }
        //       DanceVictory4() 
  

          

        //   }
        // }

















        }
          if (isDebugging) console.log('Shooting Area: no entities hit')
          //play audio - miss
          PlayShotSound(1)
          losescoreantonio += 10
          console.log(losescoreantonio)


          



          
      
            if ( losescoreantonio >= 400) {
              
              
              console.log('vc perdeu')

              

              
              PlayWinSound(0)

              if (losescoreantonio >= 50) {
                (losescoreantonio = 0) 
              }
              

              inShootingArea = false

              
            let dancelose = engine.addEntity()



            GltfContainer.create(dancelose, {
              src: 'models/shooting-range/win.glb'
            })
            
            Transform.create(dancelose, {
              position: Vector3.create(64, 0, 0),
              
            })
            
            
            Animator.create(dancelose, {
              states: [
                {
                  clip: '1',
                  playing: true, 
                  shouldReset: false,
                  loop: false,
                 
                }
            
              ]
            })
            Animator.playSingleAnimation(dancelose, '1', true )

             
            
  
        
              // const entity = engine.addEntity()
              // Transform.create(entity, {
               
              //   position: { x: 16, y: 1, z: 16 }
              // })

        
              // //  add custom model
              // GltfContainer.create(entity, {
              //   src: MVICTORYANIMATION,
              //   visibleMeshesCollisionMask: undefined,
              //   invisibleMeshesCollisionMask: undefined
              // })


              
            
          }

            

        }
      }
    )
  }




























  /** returns the shooting area entity, only one instance is maintained. */
  export function GetSurfaceObject(): Entity {
    //ensure shooting area has been initialized
    if (shootingAreaEntity == undefined) {
      if (isDebugging) console.log('Shooting Area: object does not exist, creating new shooting area...')

      //create shooting area floor
      //  entity
      shootingFloorEntity = engine.addEntity()
      Transform.create(shootingFloorEntity, { scale: { x: SHOOTING_AREA_SCALE.x, y: 1, z: SHOOTING_AREA_SCALE.z } })
      //  shape & collider
      MeshRenderer.setBox(shootingFloorEntity)
      MeshCollider.setBox(shootingFloorEntity)
      //  material
      Material.setPbrMaterial(shootingFloorEntity, {
        albedoColor: Color4.Red(),
        emissiveColor: undefined,
        emissiveIntensity: 0
      })

      //create shooting area object
      //  entity
      shootingAreaEntity = engine.addEntity()
      Transform.create(shootingAreaEntity, { scale: SHOOTING_AREA_SCALE })

    













      //  trigger area
      utils.triggers.addTrigger(
        shootingAreaEntity,
        utils.NO_LAYERS,
        utils.LAYER_1,
        [{ type: 'box', scale: SHOOTING_AREA_SCALE }],
        //entry callback
        function (otherEntity) {
          console.log(`trigger area entered, object=${otherEntity}!`)
          inShootingArea = true
          //update floor material
          Material.setPbrMaterial(shootingFloorEntity, {
            albedoColor: Color4.Yellow(),
            emissiveColor: Color4.Yellow(),
            emissiveIntensity: 1
          })
        },







        //exit callback
        function (otherEntity) {
          console.log(`trigger area exited, object=${otherEntity}!`)
          inShootingArea = false
          //update floor material
          Material.setPbrMaterial(shootingFloorEntity, {
            albedoColor: Color4.Red(),
            emissiveColor: undefined,
            emissiveIntensity: 0
          })
        }
      )

      if (isDebugging) console.log('Shooting Area: created new shooting area!')
    }
    return shootingAreaEntity
  }

  /** moves the shooting area to the given location */
  export function Move(mod: ShootingAreaTransformData) {
    if (isDebugging)
      console.log('Shooting Area: object moved to pos(x=' + mod.x + ', y=' + mod.y + ', z=' + mod.z + ')')
    Transform.getMutable(GetSurfaceObject()).position = mod
    Transform.getMutable(shootingFloorEntity).position = { x: mod.x, y: mod.y - 0.45, z: mod.z }
  }
}
