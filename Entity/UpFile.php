<?php
namespace SpookyIsland\UploadBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 *
 */
class UpFile
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    public $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()     
     */
    public $name;
    
    public function getName()
    {
        return $this->name;
    }
    
    /**
     * @ORM\Column(type="string", length=255)
     */
    public $path;

    public function getPath()
    {        
        return $this->path;
    }

    public function getRootDir()
    {
        // the absolute directory path where uploaded documents should be saved
        return $this->rootdir;
    }
    
    public $type;

    public function getType()
    {        
        return $this->type;
    }
    
    /**
    * @ORM\Column(type="string", length=255)
    * 
    */
    public $time;
    
    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function setTime()
    {        
        $this->time = date('d-m-Y H:i');
    }
    
    public function getTime()
    {        
        return $this->time;
    }
   
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    public $color;
    
    public function getColor()
    {
        return $this->color;
    }

    public $file;    

    /**
     * Gets file.     
     */
    public function getFile()
    {
        return $this->file;
    }
    
    /**
     * @ORM\Column(type="string", length=255)
     * 
     **/
    public $usern;
    
    public function setUsern($usern)
    {
        $this->usern = $usern;
    }
    
    public function getUsern()
    {
        return $this->usern;
    }
    
    public function validation()
    {
        if (null === $this->getFile()) {
           throw new \RuntimeException('No file to upload');
        }
        
        if (is_numeric(rtrim($this->getName(), ".gpx"))) {
            die ("<div style='width:315px; height:140px; border:solid 2px red;'><h4 style='position:relative; left:10px'>Invalid file name!</h4><ul><li style='list-style-type:square; position:relative; left:25px'>file name can not be numeric</li></ul></div>");
        }                
    
        if (is_numeric(substr($this->getName(), 0, 1))) {
            die ("<div style='width:315px; height:140px; border:solid 2px red;'><h4 style='position:relative; left:10px'>Invalid file name!</h4><ul><li style='list-style-type:square; position:relative; left:25px'>file name can not start with a number</li></ul></div>");
        }
        
        if (mb_strlen($this->getName()) > 25 or mb_strlen($this->getName()) < 8) {
            die ("<div style='width:315px; height:140px; border:solid 2px red;'><h4 style='position:relative; left:10px'>Invalid file name!</h4><ul><li style='list-style-type:square; position:relative; left:25px'>file name has to be between 8 and 25 characters</li></ul></div>");
        }
        
        if (file_exists($this->getRootDir() . "/" . $this->getName())) {
            die ("<div style='width:315px; height:140px; border:solid 2px red;'><h4 style='position:relative; left:10px'>Invalid file name!</h4><ul><li style='list-style-type:square; position:relative; left:25px'>file name already in the database - <br>rename the file or upload another file</li></ul></div>");
        }
        
        if (substr($this->getName(), -4) !== ".gpx") {
            die ("<div style='width:315px; height:140px; border:solid 2px red;'><h4 style='position:relative; left:10px'>Invalid file extension!</h4><ul><li style='list-style-type:square; position:relative; left:25px'>file extension must be .gpx</li></ul></div>");
        }
        
        if (!$this->getType() == "application/xml" || !$this->getType() == "application/octet-stream") {
            die ("<div style='width:315px; height:140px; border:solid 2px red;'><h4 style='position:relative; left:px'>Invalid file type!</h4><ul><li style='list-style-type:square; position:relative; left:25px'>the mime type of this file is not allowed</li></ul></div>");
        }
    }
}
