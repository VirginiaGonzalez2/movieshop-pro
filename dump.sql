--
-- PostgreSQL database dump
--

\restrict zYlaj7DUf1pmxML8fRE2e48MJPwGzxSSedzEnslX5hKElR6fld12Bqr8TEe5ud5

-- Dumped from database version 17.9
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: DiscountScope; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiscountScope" AS ENUM (
    'ALL_PRODUCTS',
    'SELECTED_PRODUCTS'
);


ALTER TYPE public."DiscountScope" OWNER TO postgres;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT'
);


ALTER TYPE public."DiscountType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'SHIPPED',
    'CANCELLED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ACTOR',
    'DIRECTOR'
);


ALTER TYPE public."Role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AnalyticsConfig; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnalyticsConfig" (
    id integer NOT NULL,
    "gaId" text,
    "gtmId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AnalyticsConfig" OWNER TO postgres;

--
-- Name: AnalyticsConfig_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AnalyticsConfig_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AnalyticsConfig_id_seq" OWNER TO postgres;

--
-- Name: AnalyticsConfig_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AnalyticsConfig_id_seq" OWNED BY public."AnalyticsConfig".id;


--
-- Name: ContactMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ContactMessage" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ContactMessage" OWNER TO postgres;

--
-- Name: ContactMessage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ContactMessage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ContactMessage_id_seq" OWNER TO postgres;

--
-- Name: ContactMessage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ContactMessage_id_seq" OWNED BY public."ContactMessage".id;


--
-- Name: DiscountCode; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DiscountCode" (
    id integer NOT NULL,
    code text NOT NULL,
    type public."DiscountType" NOT NULL,
    value numeric(65,30) NOT NULL,
    scope public."DiscountScope" NOT NULL,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "usageLimit" integer,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DiscountCode" OWNER TO postgres;

--
-- Name: DiscountCodeMovie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DiscountCodeMovie" (
    "discountCodeId" integer NOT NULL,
    "movieId" integer NOT NULL
);


ALTER TABLE public."DiscountCodeMovie" OWNER TO postgres;

--
-- Name: DiscountCode_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DiscountCode_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DiscountCode_id_seq" OWNER TO postgres;

--
-- Name: DiscountCode_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DiscountCode_id_seq" OWNED BY public."DiscountCode".id;


--
-- Name: Genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Genre" (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."Genre" OWNER TO postgres;

--
-- Name: Genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Genre_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Genre_id_seq" OWNER TO postgres;

--
-- Name: Genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Genre_id_seq" OWNED BY public."Genre".id;


--
-- Name: IntegrationConfig; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."IntegrationConfig" (
    id integer NOT NULL,
    platform text NOT NULL,
    "apiKey" text,
    settings jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."IntegrationConfig" OWNER TO postgres;

--
-- Name: IntegrationConfig_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."IntegrationConfig_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."IntegrationConfig_id_seq" OWNER TO postgres;

--
-- Name: IntegrationConfig_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."IntegrationConfig_id_seq" OWNED BY public."IntegrationConfig".id;


--
-- Name: Movie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Movie" (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price numeric(65,30) NOT NULL,
    "releaseDate" timestamp(3) without time zone NOT NULL,
    runtime integer NOT NULL,
    "imageUrl" text,
    stock integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "trailerUrl" text
);


ALTER TABLE public."Movie" OWNER TO postgres;

--
-- Name: MovieGenre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MovieGenre" (
    "movieId" integer NOT NULL,
    "genreId" integer NOT NULL
);


ALTER TABLE public."MovieGenre" OWNER TO postgres;

--
-- Name: MoviePerson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MoviePerson" (
    "movieId" integer NOT NULL,
    "personId" integer NOT NULL,
    role public."Role" NOT NULL
);


ALTER TABLE public."MoviePerson" OWNER TO postgres;

--
-- Name: MovieRating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MovieRating" (
    id integer NOT NULL,
    "movieId" integer NOT NULL,
    "userId" text NOT NULL,
    value integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MovieRating" OWNER TO postgres;

--
-- Name: MovieRating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MovieRating_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MovieRating_id_seq" OWNER TO postgres;

--
-- Name: MovieRating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MovieRating_id_seq" OWNED BY public."MovieRating".id;


--
-- Name: Movie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Movie_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Movie_id_seq" OWNER TO postgres;

--
-- Name: Movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Movie_id_seq" OWNED BY public."Movie".id;


--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "totalAmount" numeric(65,30) NOT NULL,
    status public."OrderStatus" NOT NULL,
    "orderDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "authUserId" text
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "movieId" integer NOT NULL,
    quantity integer NOT NULL,
    "priceAtPurchase" numeric(65,30) NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OrderItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OrderItem_id_seq" OWNER TO postgres;

--
-- Name: OrderItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OrderItem_id_seq" OWNED BY public."OrderItem".id;


--
-- Name: Order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Order_id_seq" OWNER TO postgres;

--
-- Name: Order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Order_id_seq" OWNED BY public."Order".id;


--
-- Name: Person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Person" (
    id integer NOT NULL,
    name text NOT NULL,
    bio text
);


ALTER TABLE public."Person" OWNER TO postgres;

--
-- Name: Person_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Person_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Person_id_seq" OWNER TO postgres;

--
-- Name: Person_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Person_id_seq" OWNED BY public."Person".id;


--
-- Name: PromoBar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PromoBar" (
    id integer NOT NULL,
    "promoText" text NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "visiblePages" text NOT NULL,
    color text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PromoBar" OWNER TO postgres;

--
-- Name: PromoBar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PromoBar_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PromoBar_id_seq" OWNER TO postgres;

--
-- Name: PromoBar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PromoBar_id_seq" OWNED BY public."PromoBar".id;


--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WishlistItem" (
    id integer NOT NULL,
    "movieId" integer NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WishlistItem" OWNER TO postgres;

--
-- Name: WishlistItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."WishlistItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."WishlistItem_id_seq" OWNER TO postgres;

--
-- Name: WishlistItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."WishlistItem_id_seq" OWNED BY public."WishlistItem".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp(3) without time zone,
    "refreshTokenExpiresAt" timestamp(3) without time zone,
    scope text,
    password text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    id text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL,
    "impersonatedBy" text
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "emailVerified" boolean DEFAULT false NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "banExpires" timestamp(3) without time zone,
    "banReason" text,
    banned boolean DEFAULT false NOT NULL,
    role text DEFAULT 'user'::text NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: verification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification (
    id text NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification OWNER TO postgres;

--
-- Name: AnalyticsConfig id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnalyticsConfig" ALTER COLUMN id SET DEFAULT nextval('public."AnalyticsConfig_id_seq"'::regclass);


--
-- Name: ContactMessage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactMessage" ALTER COLUMN id SET DEFAULT nextval('public."ContactMessage_id_seq"'::regclass);


--
-- Name: DiscountCode id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountCode" ALTER COLUMN id SET DEFAULT nextval('public."DiscountCode_id_seq"'::regclass);


--
-- Name: Genre id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Genre" ALTER COLUMN id SET DEFAULT nextval('public."Genre_id_seq"'::regclass);


--
-- Name: IntegrationConfig id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IntegrationConfig" ALTER COLUMN id SET DEFAULT nextval('public."IntegrationConfig_id_seq"'::regclass);


--
-- Name: Movie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie" ALTER COLUMN id SET DEFAULT nextval('public."Movie_id_seq"'::regclass);


--
-- Name: MovieRating id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieRating" ALTER COLUMN id SET DEFAULT nextval('public."MovieRating_id_seq"'::regclass);


--
-- Name: Order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order" ALTER COLUMN id SET DEFAULT nextval('public."Order_id_seq"'::regclass);


--
-- Name: OrderItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem" ALTER COLUMN id SET DEFAULT nextval('public."OrderItem_id_seq"'::regclass);


--
-- Name: Person id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person" ALTER COLUMN id SET DEFAULT nextval('public."Person_id_seq"'::regclass);


--
-- Name: PromoBar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PromoBar" ALTER COLUMN id SET DEFAULT nextval('public."PromoBar_id_seq"'::regclass);


--
-- Name: WishlistItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem" ALTER COLUMN id SET DEFAULT nextval('public."WishlistItem_id_seq"'::regclass);


--
-- Data for Name: AnalyticsConfig; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnalyticsConfig" (id, "gaId", "gtmId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ContactMessage" (id, name, email, message, "createdAt") FROM stdin;
\.


--
-- Data for Name: DiscountCode; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DiscountCode" (id, code, type, value, scope, "startsAt", "endsAt", "isActive", "usageLimit", "usageCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DiscountCodeMovie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DiscountCodeMovie" ("discountCodeId", "movieId") FROM stdin;
\.


--
-- Data for Name: Genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Genre" (id, name, description) FROM stdin;
1	Action	Fast-paced movies with intense sequences and high-stakes conflict.
2	Animation	Animated stories for all ages, from family adventures to mature themes.
3	Comedy	Lighthearted films designed to entertain through humor and wit.
4	Drama	Character-driven stories focused on emotion, conflict, and realism.
5	Romance	Love-centered stories exploring relationships and emotional connection.
6	Sci-Fi	Speculative films featuring futuristic technology, science, or space themes.
7	Thriller	Suspenseful movies built around tension, danger, and twists.
\.


--
-- Data for Name: IntegrationConfig; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."IntegrationConfig" (id, platform, "apiKey", settings, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Movie; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Movie" (id, title, description, price, "releaseDate", runtime, "imageUrl", stock, "createdAt", "updatedAt", "trailerUrl") FROM stdin;
1	The Dark Knight	The Dark Knight is a action feature directed by Christopher Nolan. With a runtime of 152 minutes, it balances atmosphere, emotion, and strong storytelling. Christian Bale leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	19.990000000000000000000000000000	2008-01-01 00:00:00	152	/images/the_dark_knight.jpeg	20	2026-03-08 22:51:02.226	2026-03-08 22:51:02.226	https://www.youtube.com/watch?v=EXeTwQWrcwY
2	Inception	Inception is a sci-fi feature directed by Christopher Nolan. With a runtime of 148 minutes, it balances atmosphere, emotion, and strong storytelling. Leonardo DiCaprio leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	17.990000000000000000000000000000	2010-01-01 00:00:00	148	/images/inception.jpeg	20	2026-03-08 22:51:02.242	2026-03-08 22:51:02.242	https://www.youtube.com/watch?v=YoHD9XEInc0
3	Interstellar	Interstellar is a sci-fi feature directed by Christopher Nolan. With a runtime of 169 minutes, it balances atmosphere, emotion, and strong storytelling. Matthew McConaughey leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	18.990000000000000000000000000000	2014-01-01 00:00:00	169	/images/interstellar.jpeg	20	2026-03-08 22:51:02.255	2026-03-08 22:51:02.255	https://www.youtube.com/watch?v=zSWdZVtXT7E
4	A Quiet Place	A Quiet Place is a thriller feature directed by John Krasinski. With a runtime of 90 minutes, it balances atmosphere, emotion, and strong storytelling. Emily Blunt leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	14.490000000000000000000000000000	2018-01-01 00:00:00	90	/images/a_quiet_place.jpeg	20	2026-03-08 22:51:02.262	2026-03-08 22:51:02.262	https://www.youtube.com/watch?v=WR7cc5t7tv8
5	Everything Everywhere All at Once	Everything Everywhere All at Once is a sci-fi feature directed by Daniel Kwan. With a runtime of 139 minutes, it balances atmosphere, emotion, and strong storytelling. Michelle Yeoh leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	18.490000000000000000000000000000	2022-01-01 00:00:00	139	/images/everything_everywhere_all_at_once.jpeg	20	2026-03-08 22:51:02.268	2026-03-08 22:51:02.268	https://www.youtube.com/watch?v=wxN1T1uxQ2g
6	Knives Out	Knives Out is a thriller feature directed by Rian Johnson. With a runtime of 130 minutes, it balances atmosphere, emotion, and strong storytelling. Daniel Craig leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	13.990000000000000000000000000000	2019-01-01 00:00:00	130	/images/knives_out.jpeg	20	2026-03-08 22:51:02.274	2026-03-08 22:51:02.274	https://www.youtube.com/watch?v=qGqiHJTsRkQ
7	Lady Bird	Lady Bird is a drama feature directed by Greta Gerwig. With a runtime of 94 minutes, it balances atmosphere, emotion, and strong storytelling. Saoirse Ronan leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	11.990000000000000000000000000000	2017-01-01 00:00:00	94	/images/lady_bird.jpeg	20	2026-03-08 22:51:02.279	2026-03-08 22:51:02.279	https://www.youtube.com/watch?v=cNi_HC839Wo
8	Pan's Labyrinth	Pan's Labyrinth is a drama feature directed by Guillermo del Toro. With a runtime of 118 minutes, it balances atmosphere, emotion, and strong storytelling. Ivana Baquero leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	12.990000000000000000000000000000	2006-01-01 00:00:00	118	/images/pans_labyrinth.jpeg	20	2026-03-08 22:51:02.283	2026-03-08 22:51:02.283	https://www.youtube.com/watch?v=EqYiSlkvRuw
9	Spirited Away	Spirited Away is a animation feature directed by Hayao Miyazaki. With a runtime of 125 minutes, it balances atmosphere, emotion, and strong storytelling. Rumi Hiiragi leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	16.490000000000000000000000000000	2001-01-01 00:00:00	125	/images/spirited_away.jpeg	20	2026-03-08 22:51:02.287	2026-03-08 22:51:02.287	https://www.youtube.com/watch?v=ByXuk9QqQkk
10	The Big Lebowski	The Big Lebowski is a drama feature directed by Joel Coen. With a runtime of 117 minutes, it balances atmosphere, emotion, and strong storytelling. Jeff Bridges leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	10.990000000000000000000000000000	1998-01-01 00:00:00	117	/images/the_big_lebowski.jpeg	20	2026-03-08 22:51:02.292	2026-03-08 22:51:02.292	https://www.youtube.com/watch?v=cd-go0oBF4Y
11	The Godfather	The Godfather is a drama feature directed by Francis Ford Coppola. With a runtime of 175 minutes, it balances atmosphere, emotion, and strong storytelling. Al Pacino leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	17.490000000000000000000000000000	1972-01-01 00:00:00	175	/images/the_godfather.jpeg	20	2026-03-08 22:51:02.297	2026-03-08 22:51:02.297	https://www.youtube.com/watch?v=UaVTIH8mujA
12	The Shawshank Redemption	The Shawshank Redemption is a drama feature directed by Frank Darabont. With a runtime of 142 minutes, it balances atmosphere, emotion, and strong storytelling. Tim Robbins leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	16.990000000000000000000000000000	1994-01-01 00:00:00	142	/images/the_shawshank_redemption.jpeg	20	2026-03-08 22:51:02.302	2026-03-08 22:51:02.302	https://www.youtube.com/watch?v=NmzuHjWmXOc
13	The Terminator	The Terminator is a action feature directed by James Cameron. With a runtime of 107 minutes, it balances atmosphere, emotion, and strong storytelling. Arnold Schwarzenegger leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	12.490000000000000000000000000000	1984-01-01 00:00:00	107	/images/the_terminator.jpeg	20	2026-03-08 22:51:02.306	2026-03-08 22:51:02.306	https://www.youtube.com/watch?v=k64P4l2Wmeg
14	Parasite	Parasite is a drama feature directed by Bong Joon-ho. With a runtime of 132 minutes, it balances atmosphere, emotion, and strong storytelling. Song Kang-ho leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	14.990000000000000000000000000000	2019-01-01 00:00:00	132	/images/parasite.jpeg	20	2026-03-08 22:51:02.31	2026-03-08 22:51:02.31	https://www.youtube.com/watch?v=5xH0HfJHsaY
15	The Matrix	The Matrix is a sci-fi feature directed by Lana Wachowski. With a runtime of 136 minutes, it balances atmosphere, emotion, and strong storytelling. Keanu Reeves leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	13.990000000000000000000000000000	1999-01-01 00:00:00	136	/images/the_matrix.jpeg	20	2026-03-08 22:51:02.314	2026-03-08 22:51:02.314	https://www.youtube.com/watch?v=vKQi3bBA1y8
16	Joker	Joker is a drama feature directed by Todd Phillips. With a runtime of 122 minutes, it balances atmosphere, emotion, and strong storytelling. Joaquin Phoenix leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	12.990000000000000000000000000000	2019-01-01 00:00:00	122	/images/joker.jpeg	20	2026-03-08 22:51:02.318	2026-03-08 22:51:02.318	https://www.youtube.com/watch?v=zAGVQLHvwOY
17	Her	Her is a drama feature directed by Spike Jonze. With a runtime of 126 minutes, it balances atmosphere, emotion, and strong storytelling. Joaquin Phoenix leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	11.990000000000000000000000000000	2013-01-01 00:00:00	126	/images/her.jpeg	20	2026-03-08 22:51:02.322	2026-03-08 22:51:02.322	https://www.youtube.com/watch?v=WzV6mXIOVl4
18	Coco	Coco is a animation feature directed by Lee Unkrich. With a runtime of 105 minutes, it balances atmosphere, emotion, and strong storytelling. Anthony Gonzalez leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	9.990000000000000000000000000000	2017-01-01 00:00:00	105	/images/coco.jpeg	20	2026-03-08 22:51:02.326	2026-03-08 22:51:02.326	https://www.youtube.com/watch?v=Rvr68u6k5sI
20	Casablanca	Casablanca is a romance feature directed by Michael Curtiz. With a runtime of 102 minutes, it balances atmosphere, emotion, and strong storytelling. Humphrey Bogart leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	8.990000000000000000000000000000	1942-01-01 00:00:00	102	/images/casablanca.jpeg	20	2026-03-08 22:51:02.334	2026-03-08 22:51:02.334	https://www.youtube.com/watch?v=BkL9l7qovsE
22	Moonlight	Moonlight is a drama feature directed by Barry Jenkins. With a runtime of 111 minutes, it balances atmosphere, emotion, and strong storytelling. Trevante Rhodes leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	10.490000000000000000000000000000	2016-01-01 00:00:00	111	/images/moonlight.jpeg	20	2026-03-08 22:51:02.342	2026-03-08 22:51:02.342	https://www.youtube.com/watch?v=9NJj12tJzqc
19	Blade Runner 2049	Blade Runner 2049 is a sci-fi feature directed by Denis Villeneuve. With a runtime of 164 minutes, it balances atmosphere, emotion, and strong storytelling. Ryan Gosling leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	15.990000000000000000000000000000	2017-01-01 00:00:00	164	/images/blade_runner_2049.jpeg	20	2026-03-08 22:51:02.331	2026-03-08 22:51:02.331	https://www.youtube.com/watch?v=gCcx85zbxz4
21	La La Land	La La Land is a romance feature directed by Damien Chazelle. With a runtime of 128 minutes, it balances atmosphere, emotion, and strong storytelling. Emma Stone leads a compelling performance that keeps every scene engaging. A polished and memorable choice for any movie night.	13.490000000000000000000000000000	2016-01-01 00:00:00	128	/images/la_la_land.jpeg	20	2026-03-08 22:51:02.338	2026-03-08 22:51:02.338	https://www.youtube.com/watch?v=0pdqf4P9MB8
\.


--
-- Data for Name: MovieGenre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MovieGenre" ("movieId", "genreId") FROM stdin;
1	1
2	6
3	6
4	7
5	6
6	7
7	4
8	4
9	2
10	4
11	4
12	4
13	1
14	4
15	6
16	4
17	4
18	2
19	6
20	5
21	5
22	4
\.


--
-- Data for Name: MoviePerson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MoviePerson" ("movieId", "personId", role) FROM stdin;
1	1	DIRECTOR
1	2	ACTOR
2	1	DIRECTOR
2	3	ACTOR
3	1	DIRECTOR
3	4	ACTOR
4	5	DIRECTOR
4	6	ACTOR
5	7	DIRECTOR
5	8	ACTOR
6	10	DIRECTOR
6	9	ACTOR
7	12	DIRECTOR
7	11	ACTOR
8	13	DIRECTOR
8	14	ACTOR
9	15	DIRECTOR
9	16	ACTOR
10	17	DIRECTOR
10	18	ACTOR
11	19	DIRECTOR
11	20	ACTOR
12	21	DIRECTOR
12	22	ACTOR
13	24	DIRECTOR
13	23	ACTOR
14	25	DIRECTOR
14	26	ACTOR
15	27	DIRECTOR
15	28	ACTOR
16	29	DIRECTOR
16	30	ACTOR
17	31	DIRECTOR
17	30	ACTOR
18	32	DIRECTOR
18	33	ACTOR
19	34	DIRECTOR
19	35	ACTOR
20	36	DIRECTOR
20	37	ACTOR
21	38	DIRECTOR
21	39	ACTOR
22	40	DIRECTOR
22	41	ACTOR
\.


--
-- Data for Name: MovieRating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MovieRating" (id, "movieId", "userId", value, "createdAt", "updatedAt") FROM stdin;
23	1	user-1	5	2026-03-08 23:14:10.412	2026-03-09 12:55:05.735
24	2	user-1	5	2026-03-08 23:14:10.422	2026-03-09 12:55:05.744
25	3	user-1	5	2026-03-08 23:14:10.429	2026-03-09 12:55:05.752
26	4	user-1	4	2026-03-08 23:14:10.436	2026-03-09 12:55:05.759
27	5	user-1	5	2026-03-08 23:14:10.44	2026-03-09 12:55:05.762
28	6	user-1	4	2026-03-08 23:14:10.444	2026-03-09 12:55:05.766
29	7	user-1	4	2026-03-08 23:14:10.447	2026-03-09 12:55:05.769
30	8	user-1	5	2026-03-08 23:14:10.45	2026-03-09 12:55:05.773
31	9	user-1	5	2026-03-08 23:14:10.453	2026-03-09 12:55:05.776
32	10	user-1	4	2026-03-08 23:14:10.456	2026-03-09 12:55:05.779
33	11	user-1	5	2026-03-08 23:14:10.459	2026-03-09 12:55:05.781
34	12	user-1	5	2026-03-08 23:14:10.462	2026-03-09 12:55:05.784
35	13	user-1	4	2026-03-08 23:14:10.465	2026-03-09 12:55:05.787
36	14	user-1	5	2026-03-08 23:14:10.467	2026-03-09 12:55:05.789
37	15	user-1	5	2026-03-08 23:14:10.47	2026-03-09 12:55:05.792
38	16	user-1	4	2026-03-08 23:14:10.472	2026-03-09 12:55:05.794
39	17	user-1	4	2026-03-08 23:14:10.474	2026-03-09 12:55:05.796
40	18	user-1	4	2026-03-08 23:14:10.477	2026-03-09 12:55:05.798
41	19	user-1	4	2026-03-08 23:14:10.479	2026-03-09 12:55:05.801
42	20	user-1	5	2026-03-08 23:14:10.482	2026-03-09 12:55:05.803
43	21	user-1	4	2026-03-08 23:14:10.484	2026-03-09 12:55:05.805
44	22	user-1	4	2026-03-08 23:14:10.486	2026-03-09 12:55:05.807
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", "totalAmount", status, "orderDate", "authUserId") FROM stdin;
1	user-1	0.000000000000000000000000000000	PAID	2026-03-08 22:51:02.347	\N
2	user-1	0.000000000000000000000000000000	PAID	2026-03-08 23:14:10.488	\N
3	user-1	0.000000000000000000000000000000	PAID	2026-03-09 12:55:05.809	\N
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "movieId", quantity, "priceAtPurchase") FROM stdin;
1	1	1	22	19.990000000000000000000000000000
2	1	2	21	17.990000000000000000000000000000
3	1	3	20	18.990000000000000000000000000000
4	1	4	19	14.490000000000000000000000000000
5	1	5	18	18.490000000000000000000000000000
6	1	6	17	13.990000000000000000000000000000
7	1	7	16	11.990000000000000000000000000000
8	1	8	15	12.990000000000000000000000000000
9	1	9	14	16.490000000000000000000000000000
10	1	10	13	10.990000000000000000000000000000
11	1	11	12	17.490000000000000000000000000000
12	1	12	11	16.990000000000000000000000000000
13	1	13	10	12.490000000000000000000000000000
14	1	14	9	14.990000000000000000000000000000
15	1	15	8	13.990000000000000000000000000000
16	1	16	7	12.990000000000000000000000000000
17	1	17	6	11.990000000000000000000000000000
18	1	18	5	9.990000000000000000000000000000
19	1	19	4	15.990000000000000000000000000000
20	1	20	3	8.990000000000000000000000000000
21	1	21	2	13.490000000000000000000000000000
22	1	22	1	10.490000000000000000000000000000
23	2	1	22	19.990000000000000000000000000000
24	2	2	21	17.990000000000000000000000000000
25	2	3	20	18.990000000000000000000000000000
26	2	4	19	14.490000000000000000000000000000
27	2	5	18	18.490000000000000000000000000000
28	2	6	17	13.990000000000000000000000000000
29	2	7	16	11.990000000000000000000000000000
30	2	8	15	12.990000000000000000000000000000
31	2	9	14	16.490000000000000000000000000000
32	2	10	13	10.990000000000000000000000000000
33	2	11	12	17.490000000000000000000000000000
34	2	12	11	16.990000000000000000000000000000
35	2	13	10	12.490000000000000000000000000000
36	2	14	9	14.990000000000000000000000000000
37	2	15	8	13.990000000000000000000000000000
38	2	16	7	12.990000000000000000000000000000
39	2	17	6	11.990000000000000000000000000000
40	2	18	5	9.990000000000000000000000000000
41	2	19	4	15.990000000000000000000000000000
42	2	20	3	8.990000000000000000000000000000
43	2	21	2	13.490000000000000000000000000000
44	2	22	1	10.490000000000000000000000000000
45	3	1	22	19.990000000000000000000000000000
46	3	2	21	17.990000000000000000000000000000
47	3	3	20	18.990000000000000000000000000000
48	3	4	19	14.490000000000000000000000000000
49	3	5	18	18.490000000000000000000000000000
50	3	6	17	13.990000000000000000000000000000
51	3	7	16	11.990000000000000000000000000000
52	3	8	15	12.990000000000000000000000000000
53	3	9	14	16.490000000000000000000000000000
54	3	10	13	10.990000000000000000000000000000
55	3	11	12	17.490000000000000000000000000000
56	3	12	11	16.990000000000000000000000000000
57	3	13	10	12.490000000000000000000000000000
58	3	14	9	14.990000000000000000000000000000
59	3	15	8	13.990000000000000000000000000000
60	3	16	7	12.990000000000000000000000000000
61	3	17	6	11.990000000000000000000000000000
62	3	18	5	9.990000000000000000000000000000
63	3	19	4	15.990000000000000000000000000000
64	3	20	3	8.990000000000000000000000000000
65	3	21	2	13.490000000000000000000000000000
66	3	22	1	10.490000000000000000000000000000
\.


--
-- Data for Name: Person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Person" (id, name, bio) FROM stdin;
1	Christopher Nolan	\N
2	Christian Bale	\N
3	Leonardo DiCaprio	\N
4	Matthew McConaughey	\N
5	John Krasinski	\N
6	Emily Blunt	\N
7	Daniel Kwan	\N
8	Michelle Yeoh	\N
9	Daniel Craig	\N
10	Rian Johnson	\N
11	Saoirse Ronan	\N
12	Greta Gerwig	\N
13	Guillermo del Toro	\N
14	Ivana Baquero	\N
15	Hayao Miyazaki	\N
16	Rumi Hiiragi	\N
17	Joel Coen	\N
18	Jeff Bridges	\N
19	Francis Ford Coppola	\N
20	Al Pacino	\N
21	Frank Darabont	\N
22	Tim Robbins	\N
23	Arnold Schwarzenegger	\N
24	James Cameron	\N
25	Bong Joon-ho	\N
26	Song Kang-ho	\N
27	Lana Wachowski	\N
28	Keanu Reeves	\N
29	Todd Phillips	\N
30	Joaquin Phoenix	\N
31	Spike Jonze	\N
32	Lee Unkrich	\N
33	Anthony Gonzalez	\N
34	Denis Villeneuve	\N
35	Ryan Gosling	\N
36	Michael Curtiz	\N
37	Humphrey Bogart	\N
38	Damien Chazelle	\N
39	Emma Stone	\N
40	Barry Jenkins	\N
41	Trevante Rhodes	\N
\.


--
-- Data for Name: PromoBar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PromoBar" (id, "promoText", "endDate", "visiblePages", color, "updatedAt") FROM stdin;
1	HOLLIDAYS IN SWEDEN WITH MOVIESHOP 70% OFF-Use Code: EasterMovieshop26	2026-03-10 19:59:00	/	#2563eb	2026-03-09 10:15:52.744
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WishlistItem" (id, "movieId", "userId", "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
922387fb-2741-4cd4-a7cf-f5f6e8828271	5ddd34007cc37c1c6ce5ce4e94c5cf51cb21aaeca6fb36badb940cdfb3abfc76	2026-03-08 23:51:01.792137+01	20260203224045_init	\N	\N	2026-03-08 23:51:01.782618+01	1
f49a4c39-2674-4835-b502-fbe1c42b815a	d8f8ddeb8b44ff4fca104d711e32e2296c6b33a122f4c534408d68a455e9d904	2026-03-08 23:51:01.79825+01	20260204075351_better_auth	\N	\N	2026-03-08 23:51:01.792329+01	1
a8e26b36-6662-4849-9d4b-854e7dc30822	29d339b094734c791c423c0fa42966a4f04514542d31599d754a0bfb9a371441	2026-03-09 00:14:03.820106+01	20260308231403_ensure_promobar_table	\N	\N	2026-03-09 00:14:03.816252+01	1
28e93d89-7d2e-4023-80da-9f073533880a	6c77b847d201940467a0ccbca8acb63ba387de2d705ced5368e81ef2bbc18c6c	2026-03-08 23:51:01.799195+01	20260217041014_add_movie_rating	\N	\N	2026-03-08 23:51:01.798431+01	1
cf8733d0-cc67-4902-b087-a97a470b27ea	ae737d79429e0ce5dd45d3c4e283fd83d289bd705713a31529a8da28459a1af8	2026-03-08 23:51:01.801699+01	20260222131752_add_contact_message	\N	\N	2026-03-08 23:51:01.799358+01	1
cba8ede6-8c3a-4eea-bce3-924d5f88c594	9c9e579eeff9b1d22068648c5dc135d57dee37242413841002ef32575f25a77a	2026-03-08 23:51:01.802472+01	20260223013152_add_movie_trailer_url	\N	\N	2026-03-08 23:51:01.801874+01	1
dad8582b-ee42-4ec4-9dd4-eacf9b70e07e	bf5e27bff2d48582e2583abee8e0fafa91afc96e5834bcb8154685676bf5dc7a	2026-03-09 17:57:18.93625+01	20260309165718_add_analytics_config	\N	\N	2026-03-09 17:57:18.932338+01	1
17bec548-c454-484d-8296-1eed5b76eb1f	7e95d21b54fb8080ef4ba58f0d06e031209b2565ee462b4f980f169e7935f7cc	2026-03-08 23:51:01.805884+01	20260224014820_real_ratings_movie_rating_table	\N	\N	2026-03-08 23:51:01.802647+01	1
67fce702-7b33-44fd-8e09-c27b45ffd1f0	a8b918b9bb1c024b267cfc4f028464c7cd828dcb63ad63176171107396f6efd4	2026-03-08 23:51:01.808676+01	20260224023140_real_rating_and_wishlist	\N	\N	2026-03-08 23:51:01.80606+01	1
27bf2af8-b10f-4ee2-8861-68ec8463f3bf	9bc2f4eabe2c09c61e69866178dfee8d9ded4de36a2fc388d18e8451d4339499	2026-03-08 23:51:01.810379+01	20260224191430_update_movie_model	\N	\N	2026-03-08 23:51:01.808855+01	1
ff73aa5b-89b4-473e-ad37-239b563b12fd	799d4ed091f653db97728f0495272f5c44676c967669a36f1c6925057bafaec0	2026-03-08 23:51:01.813608+01	20260226001052_add_trailer_real_ratings_wishlist	\N	\N	2026-03-08 23:51:01.810575+01	1
4c2f6fe1-5549-453e-bbc7-9cc9a21dffae	7b7443394e04c65b98d4e32a53773c6911f134d8c07f351824d02afef55c64a1	2026-03-08 23:51:01.815589+01	20260226045549_add_contact_message	\N	\N	2026-03-08 23:51:01.813797+01	1
0dc11db8-072b-475c-a208-6058c89f596a	56c9bda31f36268cd3b4dd08b78a9fee714224c6f835b8911ca702b05f0a8d9f	2026-03-08 23:51:01.816528+01	20260302111543_better_auth_admin	\N	\N	2026-03-08 23:51:01.815759+01	1
00fa5692-80b8-4e68-8b39-20eb3933fa29	245467e9f12d2b315ec18b23850e92cef26334457a9543262e9661ce7f7f8de9	2026-03-08 23:51:01.821357+01	20260306103000_order_professionalization	\N	\N	2026-03-08 23:51:01.816696+01	1
113c286b-ec45-458f-a29a-7836d85ab354	84ac9f3ef511b47c4e7f0eff674a69157b30d83febe01b5b31513e7aab29f62d	2026-03-08 23:51:01.825881+01	20260307150000_add_discount_codes	\N	\N	2026-03-08 23:51:01.821635+01	1
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
TiWw7UMDzPUkikisQjCUCzXjqTulUBhU	vFCBzcxHRtcKzcr1KJQXtNEb03lM9rN0	credential	vFCBzcxHRtcKzcr1KJQXtNEb03lM9rN0	\N	\N	\N	\N	\N	\N	d385cfe5c03d6ab70b4afff3d122ade3:64dbd63b7112894454ceebb1c55e972f788a658756c96911397021159554760b3f5faaa40e68aa54dc693abe14e214c500fc7814c901edc158b92d38ab6ec5c0	2026-03-08 22:54:59.25	2026-03-08 22:54:59.25
acc-virginia	virginiagonzzalez@gmail.com	email	vFCBzcxHRtcKzcr1KJQXtNEb03lM9rN0	\N	\N	\N	\N	\N	\N	Exito2026#	2026-03-08 23:14:10.382	2026-03-09 12:55:05.705
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy") FROM stdin;
9ut1ZondH4LX70LofjgZQZAVNnP5269z	2026-03-17 08:05:11.717	9liRiPGSMrEcZea7m4KNJ7SPDYKPeaZq	2026-03-08 22:54:59.256	2026-03-10 08:05:11.717	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36	vFCBzcxHRtcKzcr1KJQXtNEb03lM9rN0	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", "banExpires", "banReason", banned, role) FROM stdin;
vFCBzcxHRtcKzcr1KJQXtNEb03lM9rN0	Virginiatest	virginiagonzzalez@gmail.com	t	\N	2026-03-08 22:54:59.243	2026-03-09 12:55:05.594	\N	\N	f	admin
user-1	Test User	test@user.com	t	\N	2026-03-08 23:14:10.387	2026-03-09 12:55:05.708	\N	\N	f	user
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: AnalyticsConfig_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AnalyticsConfig_id_seq"', 1, false);


--
-- Name: ContactMessage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ContactMessage_id_seq"', 1, false);


--
-- Name: DiscountCode_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DiscountCode_id_seq"', 1, false);


--
-- Name: Genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Genre_id_seq"', 21, true);


--
-- Name: IntegrationConfig_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."IntegrationConfig_id_seq"', 1, false);


--
-- Name: MovieRating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MovieRating_id_seq"', 66, true);


--
-- Name: Movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Movie_id_seq"', 22, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 66, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 3, true);


--
-- Name: Person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Person_id_seq"', 41, true);


--
-- Name: PromoBar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PromoBar_id_seq"', 1, false);


--
-- Name: WishlistItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."WishlistItem_id_seq"', 1, false);


--
-- Name: AnalyticsConfig AnalyticsConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnalyticsConfig"
    ADD CONSTRAINT "AnalyticsConfig_pkey" PRIMARY KEY (id);


--
-- Name: ContactMessage ContactMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY (id);


--
-- Name: DiscountCodeMovie DiscountCodeMovie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountCodeMovie"
    ADD CONSTRAINT "DiscountCodeMovie_pkey" PRIMARY KEY ("discountCodeId", "movieId");


--
-- Name: DiscountCode DiscountCode_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountCode"
    ADD CONSTRAINT "DiscountCode_pkey" PRIMARY KEY (id);


--
-- Name: Genre Genre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Genre"
    ADD CONSTRAINT "Genre_pkey" PRIMARY KEY (id);


--
-- Name: IntegrationConfig IntegrationConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IntegrationConfig"
    ADD CONSTRAINT "IntegrationConfig_pkey" PRIMARY KEY (id);


--
-- Name: MovieGenre MovieGenre_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieGenre"
    ADD CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("movieId", "genreId");


--
-- Name: MoviePerson MoviePerson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MoviePerson"
    ADD CONSTRAINT "MoviePerson_pkey" PRIMARY KEY ("movieId", "personId", role);


--
-- Name: MovieRating MovieRating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieRating"
    ADD CONSTRAINT "MovieRating_pkey" PRIMARY KEY (id);


--
-- Name: Movie Movie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Movie"
    ADD CONSTRAINT "Movie_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY (id);


--
-- Name: PromoBar PromoBar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PromoBar"
    ADD CONSTRAINT "PromoBar_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification
    ADD CONSTRAINT verification_pkey PRIMARY KEY (id);


--
-- Name: ContactMessage_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactMessage_createdAt_idx" ON public."ContactMessage" USING btree ("createdAt");


--
-- Name: ContactMessage_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ContactMessage_email_idx" ON public."ContactMessage" USING btree (email);


--
-- Name: DiscountCodeMovie_movieId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DiscountCodeMovie_movieId_idx" ON public."DiscountCodeMovie" USING btree ("movieId");


--
-- Name: DiscountCode_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DiscountCode_code_idx" ON public."DiscountCode" USING btree (code);


--
-- Name: DiscountCode_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "DiscountCode_code_key" ON public."DiscountCode" USING btree (code);


--
-- Name: DiscountCode_endsAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DiscountCode_endsAt_idx" ON public."DiscountCode" USING btree ("endsAt");


--
-- Name: DiscountCode_isActive_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DiscountCode_isActive_idx" ON public."DiscountCode" USING btree ("isActive");


--
-- Name: DiscountCode_startsAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "DiscountCode_startsAt_idx" ON public."DiscountCode" USING btree ("startsAt");


--
-- Name: Genre_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Genre_name_key" ON public."Genre" USING btree (name);


--
-- Name: MovieRating_movieId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MovieRating_movieId_idx" ON public."MovieRating" USING btree ("movieId");


--
-- Name: MovieRating_movieId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MovieRating_movieId_userId_key" ON public."MovieRating" USING btree ("movieId", "userId");


--
-- Name: MovieRating_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MovieRating_userId_idx" ON public."MovieRating" USING btree ("userId");


--
-- Name: OrderItem_movieId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_movieId_idx" ON public."OrderItem" USING btree ("movieId");


--
-- Name: OrderItem_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" USING btree ("orderId");


--
-- Name: Order_authUserId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_authUserId_idx" ON public."Order" USING btree ("authUserId");


--
-- Name: Order_orderDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_orderDate_idx" ON public."Order" USING btree ("orderDate");


--
-- Name: Order_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_status_idx" ON public."Order" USING btree (status);


--
-- Name: Order_status_orderDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_status_orderDate_idx" ON public."Order" USING btree (status, "orderDate");


--
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- Name: WishlistItem_movieId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WishlistItem_movieId_idx" ON public."WishlistItem" USING btree ("movieId");


--
-- Name: WishlistItem_movieId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WishlistItem_movieId_userId_key" ON public."WishlistItem" USING btree ("movieId", "userId");


--
-- Name: WishlistItem_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WishlistItem_userId_idx" ON public."WishlistItem" USING btree ("userId");


--
-- Name: account_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "account_userId_idx" ON public.account USING btree ("userId");


--
-- Name: session_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);


--
-- Name: session_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "session_userId_idx" ON public.session USING btree ("userId");


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX verification_identifier_idx ON public.verification USING btree (identifier);


--
-- Name: DiscountCodeMovie DiscountCodeMovie_discountCodeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountCodeMovie"
    ADD CONSTRAINT "DiscountCodeMovie_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES public."DiscountCode"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DiscountCodeMovie DiscountCodeMovie_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DiscountCodeMovie"
    ADD CONSTRAINT "DiscountCodeMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MovieGenre MovieGenre_genreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieGenre"
    ADD CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES public."Genre"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MovieGenre MovieGenre_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieGenre"
    ADD CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MoviePerson MoviePerson_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MoviePerson"
    ADD CONSTRAINT "MoviePerson_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MoviePerson MoviePerson_personId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MoviePerson"
    ADD CONSTRAINT "MoviePerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES public."Person"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MovieRating MovieRating_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieRating"
    ADD CONSTRAINT "MovieRating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MovieRating MovieRating_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovieRating"
    ADD CONSTRAINT "MovieRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_authUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WishlistItem WishlistItem_movieId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES public."Movie"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict zYlaj7DUf1pmxML8fRE2e48MJPwGzxSSedzEnslX5hKElR6fld12Bqr8TEe5ud5

