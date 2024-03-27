import React from "react";
import loadingImg from '../../assets/icon.ico'

const Loading = () => {
    return (
        <div className="" id='loading-container'>
            <div className="loading">
                <img src={loadingImg} width={150} height={150} alt="Loading" />
            </div>
            <style jsx>
                {
                    `
                    .loading {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.2);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      }
                      
                      .loading img {
                        display: inline-block;
                        position: relative;
                        background: $lite;
                        animation: flipX 1s linear infinite;
                      }

                      @keyframes flipX {
                        0%{ transform: perspective(200px) rotateX(0deg) rotateY(0deg); }
                        50%{ transform: perspective(200px) rotateX(-180deg) rotateY(0deg); }
                        100%{ transform: perspective(200px) rotateX(-180deg) rotateY(-180deg) }
                      }
                    
                    `
                }
            </style>
        </div>
    );
};

export default Loading