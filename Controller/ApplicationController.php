<?php
namespace SpookyIsland\UploadBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

class ApplicationController extends Controller
{ 
   public function lastUploadedFilesAction() {
        $db = $this->get('doctrine')->getRepository('SpookyIslandUploadBundle:UpFile');
        $query = $db->createQueryBuilder('f')->orderBy('f.id', 'DESC')->setMaxResults(5)->getQuery()->execute();
        $gb = json_encode($query);

        if ($query) {
          $content = $this->container->get('templating')->render('SpookyIslandUploadBundle:Element:lastuploadedfiles.html.twig', array(
              'gb2' => json_decode($gb, true),
              'path' => $_SERVER['SCRIPT_NAME'].'/../uploads/'
          ));
          return new Response($content);
          }
          return new Response("file was not uploaded");
    }
   
   public function deleteAction() {             
        $em = $this->container->get('doctrine')->getManager();
        $query = $em->getRepository('SpookyIslandUploadBundle:UpFile')->createQueryBuilder('fn')->where('fn.name = :filename')->setParameter('filename', $_POST['filename'])->getQuery()->getSingleResult();      

        if ($query) {  
            $em->remove($query);            
            $em->flush();
            unlink($this->container->getParameter('kernel.root_dir').'/../web/'.$_POST['filepath']);
            return new Response("files deleted");
        }
        return new Response("file could not be deleted");
    }
   
   public function findAction() {
        $fname = $_GET['fname'];

        $em = $this->container->get('doctrine')->getManager();
        $qb = $em->getRepository('SpookyIslandUploadBundle:UpFile')->createQueryBuilder('fnd');

        if (is_numeric(str_replace('-', '', $fname))) {            
            $query = $qb->where($qb->expr()->like('fnd.time', '?1'))->setParameter(1, $fname . '%')->getQuery()->execute();
            $foundtk = json_encode($query);

            if ($query) {
                $contentFdTk = $this->container->get('templating')->render('SpookyIslandUploadBundle:Element:finder.html.twig', array(
                    'foundtk2' => json_decode($foundtk, true),
                    'path2' => $_SERVER['SCRIPT_NAME'].'/../uploads/'
                ));
                return new Response($contentFdTk);
            }
            return new Response("no files found");                                                       
        }
        $query = $qb->where($qb->expr()->like('fnd.name', '?1'))->setParameter(1, $fname . '%')->getQuery()->execute();
        $foundtk = json_encode($query);

        if ($query) {
            $contentFdTk = $this->container->get('templating')->render('SpookyIslandUploadBundle:Element:finder.html.twig', array(
                'foundtk2' => json_decode($foundtk, true),
                'path2' => $_SERVER['SCRIPT_NAME'].'/../uploads/'
            ));
            return new Response($contentFdTk);
        }
        return new Response("no files found");
    }

   public function downloadAction() {
       $content = file_get_contents($this->container->getParameter('kernel.root_dir').'/../web/'.$_GET['dpath']);
       $response = new Response();
       $response->headers->set('Content-Description', 'File Transfer');
       $response->headers->set('Content-Type', 'application/octet-stream');
       $response->headers->set('Content-Disposition', 'attachment; filename="'.$_GET['dname']);
       $response->setContent($content);
       return $response;
    }
}
